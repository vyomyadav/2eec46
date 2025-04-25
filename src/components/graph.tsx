import React, { useEffect, useState, useCallback } from "react"
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from "reactflow"
import "reactflow/dist/style.css"
import { getBlueprintGraph } from "../api/api"
import PrefillPanel from "./prefillPanel"
import { BlueprintGraph, NodePrefillConfig } from "../utils/types"

export default function Graph() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [formMap, setFormMap] = useState<BlueprintGraph["forms"]>([])
  const [selectedNode, setSelectedNode] = useState<Node<any> | null>(null)
  const [config, setConfig] = useState<NodePrefillConfig>({})

  useEffect(() => {
    getBlueprintGraph().then((data: BlueprintGraph) => {
      setNodes(
        data.nodes.map(n => ({
          id: n.id,
          type: "default",
          data: {
            label: n.data.name,
            component_id: n.data.component_id,
            prerequisites: n.data.prerequisites,
          },
          position: n.position,
        }))
      )
      setEdges(data.edges)
      setFormMap(data.forms)
    })
  }, [])

  const onClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node)
  }, [])

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {selectedNode && (
        <PrefillPanel
          node={selectedNode}
          forms={formMap}
          allNodes={nodes}
          edges={edges}
          config={config}
          setConfig={setConfig}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}
