import React, { useState } from "react"
import { PrefillSource } from "../utils/types"

interface Props {
  onSelect: (source: PrefillSource) => void
  onClose: () => void
  upstreamForms: { formId: string; formName: string; fields: string[] }[]
  globalOptions: { label: string; value: PrefillSource }[]
  modalRef: React.RefObject<HTMLDivElement | null>
}

const PrefillModal = ({ onSelect, onClose, upstreamForms, globalOptions, modalRef }: Props) => {
  const [query, setQuery] = useState("")

  const formFieldOptions = upstreamForms.flatMap(form =>
    form.fields.map(field => ({
      label: `${form.formName} → ${field}`,
      value: { type: "form", formId: form.formId, field } as PrefillSource
    }))
  )

  const allOptions = [
    ...formFieldOptions,
    ...globalOptions.map(opt => ({ label: `Global → ${opt.label}`, value: opt.value }))
  ]

  const filtered = allOptions.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <div
      ref={modalRef}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 20,
        width: 400,
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        zIndex: 2000,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          Select Prefill Source
        </div>
        <button onClick={onClose} style={{ fontSize: 18, border: "none", background: "none", cursor: "pointer" }}>×</button>
      </div>

      <input
        type="text"
        placeholder="Search fields..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <ul style={{ listStyle: "none", padding: 0, maxHeight: 200, overflowY: "auto" }}>
        {filtered.map(option => (
          <li
            key={option.label}
            onClick={e => {
              e.stopPropagation()
              onSelect(option.value)
            }}
            style={{ padding: "6px 8px", cursor: "pointer", borderBottom: "1px solid #ddd" }}
          >
            {option.label}
          </li>
        ))}
      </ul>

      <button onClick={onClose} style={{ marginTop: 10 }}>Cancel</button>
    </div>
  )
}

export default PrefillModal
