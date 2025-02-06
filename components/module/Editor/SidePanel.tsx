import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DraggableElement from "./DraggableElement";

const SidePanel = () => {
  return (
    <div className="w-64 bg-popover p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Elements</h2>
      <div className="space-y-4">
        <DraggableElement type="input">
          <Input placeholder="Input element" />
        </DraggableElement>
        <DraggableElement type="button">
          <Button>Button</Button>
        </DraggableElement>
        <DraggableElement type="api">
          <Button variant="outline">API Runtime</Button>
        </DraggableElement>
        <DraggableElement type="variable">
          <Button variant="outline">Variable</Button>
        </DraggableElement>
      </div>
    </div>
  );
};

export default SidePanel;
