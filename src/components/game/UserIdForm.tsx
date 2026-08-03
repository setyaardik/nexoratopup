"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { GameField } from "@/types/game";

interface UserIdFormProps {
  fields: GameField[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onValidate: () => void;
  validating: boolean;
  validatedUsername: string | null;
  validationError: string | null;
}

export function UserIdForm({
  fields,
  values,
  onChange,
  onValidate,
  validating,
  validatedUsername,
  validationError,
}: UserIdFormProps) {
  const canValidate = fields.every((f) => !f.required || values[f.name]?.trim());

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="gradient-bg flex size-6 items-center justify-center rounded-full text-xs font-bold text-white">
          1
        </span>
        <h2 className="font-heading text-base font-bold text-text">Masukkan Data Akun</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) =>
          field.type === "select" ? (
            <Select
              key={field.name}
              label={field.label}
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              required={field.required}
            >
              <option value="" disabled>
                {field.placeholder}
              </option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              required={field.required}
            />
          )
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        disabled={!canValidate}
        isLoading={validating}
        onClick={onValidate}
      >
        Cek Username
      </Button>

      {validatedUsername && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-sm font-medium text-success">
          <CheckCircle2 className="size-4" />
          Username ditemukan: {validatedUsername}
        </div>
      )}
      {validationError && (
        <div className="mt-3 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {validationError}
        </div>
      )}
      {validating && (
        <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="size-4 animate-spin" /> Memeriksa akun...
        </div>
      )}
    </Card>
  );
}
