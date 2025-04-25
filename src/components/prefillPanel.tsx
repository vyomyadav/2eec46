import React, { useEffect, useRef, useState, useMemo } from "react"
import { NodePrefillConfig, FieldPrefillMap, PrefillSource, BlueprintForm } from "../utils/types"
import PrefillModal from "./prefillModel"

interface Props {
  node: any
  forms: BlueprintForm[]
  allNodes: any[]
  edges: any[]
  config: NodePrefillConfig
  setConfig: React.Dispatch<React.SetStateAction<NodePrefillConfig>>
  onClose?: () => void
}

const PrefillPanel = ({ node, forms, allNodes, edges, config, setConfig, onClose }: Props) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [editingField, setEditingField] = useState<string | null>(null)

  const form = useMemo(() => forms.find(f => f.id === node.data.component_id), [node.data.component_id, forms])
  const fieldNames = form ? Object.keys(form.field_schema?.properties ?? {}) : []
  const prefillMap: FieldPrefillMap = config[node.id] || {}

  const upstreamForms = useMemo(() => {
    const visited = new Set<string>()

    const dfs = (id: string) => {
      const n = allNodes.find(n => n.id === id)
      n?.data?.prerequisites?.forEach((pid: string) => {
        if (!visited.has(pid)) {
          visited.add(pid)
          dfs(pid)
        }
      })
    }
    dfs(node.id)

    return allNodes
      .filter(n => visited.has(n.id))
      .map(n => {
        const form = forms.find(f => f.id === n.data.component_id)
        if (!form) return null
        return {
          formId: n.id,
          formName: n.data?.label || "Unnamed Form",
          fields: Object.keys(form.field_schema?.properties ?? {})
        }
      })
      .filter(Boolean) as { formId: string; formName: string; fields: string[] }[]
  }, [node.id, allNodes, forms])

  const globalDataOptions = [
    { label: "Client ID", value: { type: "global", key: "client_id" } as PrefillSource },
    { label: "Action ID", value: { type: "global", key: "action_id" } as PrefillSource }
  ]

  const findFormNameByNodeId = (id: string) =>
    allNodes.find(n => n.id === id)?.data?.label ?? "Unnamed Form"

  const renderSource = (source: PrefillSource) =>
    source.type === "form"
      ? `${findFormNameByNodeId(source.formId)} → ${source.field}`
      : source.key

  const updateField = (field: string, value: PrefillSource | null) => {
    setConfig(prev => ({
      ...prev,
      [node.id]: {
        ...(prev[node.id] || {}),
        [field]: value
      }
    }))
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !modalRef.current?.contains(e.target as Node)
      ) {
        onClose?.()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <>
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 50,
          left: "50%",
          transform: "translateX(-50%)",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 20,
          width: 500,
          boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            Prefill Mapping: {node.data?.label || node.id}
          </div>
          <button onClick={onClose} style={{ fontSize: 18, border: "none", background: "none", cursor: "pointer" }}>×</button>
        </div>

        <div style={{ marginTop: 16, maxHeight: 400, overflowY: "auto" }}>
          {fieldNames.map(field => (
            <div key={field} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <div>
                <div style={{ fontWeight: 500 }}>{field}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                  {prefillMap[field] ? renderSource(prefillMap[field]!) : "Not set"}
                </div>
              </div>
              <div>
                <button onClick={() => setEditingField(field)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => updateField(field, null)}>X</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingField && (
        <PrefillModal
          upstreamForms={upstreamForms}
          globalOptions={globalDataOptions}
          onSelect={src => {
            updateField(editingField, src)
            setEditingField(null)
          }}
          onClose={() => setEditingField(null)}
          modalRef={modalRef}
        />
      )}
    </>
  )
}

export default PrefillPanel
