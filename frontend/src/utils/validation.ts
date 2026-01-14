export interface TaskValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateTaskPayload(payload: {
  description?: string;
  project?: string;
  typeOfWork?: string;
  hours?: number | string;
}): TaskValidationResult {
  const errors: string[] = [];

  if (!payload.description || !payload.description.trim()) {
    errors.push("Task description is required");
  }

  if (!payload.project || !payload.project.trim()) {
    errors.push("Project name is required");
  }

  if (!payload.typeOfWork || !payload.typeOfWork.trim()) {
    errors.push("Type of work is required");
  }

  if (!payload.hours || Number(payload.hours) <= 0) {
    errors.push("Hours must be greater than 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
