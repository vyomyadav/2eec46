import axios from "axios";

export const getBlueprintGraph = async() => {
  //This can be replaced by a variable
  const result = await axios.get("http://localhost:3001/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/graph")
  return result?.data
}