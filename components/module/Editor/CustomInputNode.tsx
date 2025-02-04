import { Handle, Position } from "@xyflow/react"
import { Input } from "@/components/ui/input"

const CustomInputNode = ({ data }: { data: { label: string } }) => {
  return (
    <div className="bg-white p-2 rounded shadow">
      <Handle type="target" position={Position.Top} />
      <Input placeholder={data.label} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default CustomInputNode

