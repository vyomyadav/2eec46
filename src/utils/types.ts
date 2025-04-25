export type PrefillSource =
  | { type: "form"; formId: string; field: string }
  | { type: "global"; key: string }

export type FieldPrefillMap = {
  [fieldName: string]: PrefillSource | null
}

export type NodePrefillConfig = {
  [nodeId: string]: FieldPrefillMap
}

export interface BlueprintNode {
  id: string;
  data: {
    name: string;
    component_id: string;
  };
}

export interface BlueprintForm {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
  ui_schema: any;
  dynamic_field_config: Record<string, any>;
}

export interface BlueprintGraph {
  nodes: any[];
  edges: any[];
  forms: BlueprintForm[];
}
