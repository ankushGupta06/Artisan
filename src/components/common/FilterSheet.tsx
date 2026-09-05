import type { ReactNode } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";

export function FilterSheet({
  open,
  onClose,
  onReset,
  onApply,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  onApply: () => void;
  children: ReactNode;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Filter & Sort"
      footer={
        <div className="flex gap-3">
          <Button variant="outline" full onClick={onReset}>
            Reset
          </Button>
          <Button variant="primary" full onClick={onApply}>
            Show Results
          </Button>
        </div>
      }
    >
      <div className="space-y-5">{children}</div>
    </Modal>
  );
}
