import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { usePrefix } from './PrefixContext';
import { cn, cnEl } from './cn';
import {
  FormGroup,
  Input,
  TextArea,
  Select,
  Checkbox,
  Switch,
  RadioGroup,
  Slider,
  FormControlColor,
  FormControlSize,
  FormControlShape,
} from './FormControls';

export interface FieldSchema {
  id: string;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'password'
    | 'email'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'switch'
    | 'radio'
    | 'slider'
    | 'date';
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string; // string regex pattern
    message?: string; // custom error message
  };
  options?: { label: string; value: any }[]; // For select, radio
  width?: 33 | 50 | 100; // Grid column span
  description?: string;
}

export interface DynamicFormProps {
  schema: FieldSchema[];
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  submitButtonText?: string;
  submitButtonColor?: FormControlColor;
  submitButtonSize?: 'sm' | 'md' | 'lg';
  submitButtonShape?: 'square' | 'rounded' | 'pill';
  resetButtonText?: string;
  showResetButton?: boolean;
  isLoading?: boolean;
  color?: FormControlColor;
  size?: FormControlSize;
  shape?: FormControlShape;
  className?: string;
}

// Helper to initialize form values based on schema definitions
const getInitialValues = (schema: FieldSchema[]): Record<string, any> => {
  const values: Record<string, any> = {};
  schema.forEach((field) => {
    if (field.defaultValue !== undefined) {
      values[field.id] = field.defaultValue;
    } else {
      switch (field.type) {
        case 'checkbox':
        case 'switch':
          values[field.id] = false;
          break;
        case 'slider':
          values[field.id] = 50;
          break;
        case 'number':
          values[field.id] = '';
          break;
        case 'select':
          values[field.id] = field.options && field.options.length > 0 ? field.options[0].value : '';
          break;
        default:
          values[field.id] = '';
      }
    }
  });
  return values;
};

export const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  onSubmit,
  submitButtonText = 'Submit',
  submitButtonColor = 'mauve',
  submitButtonSize = 'md',
  submitButtonShape = 'rounded',
  resetButtonText = 'Reset',
  showResetButton = true,
  isLoading = false,
  color = 'mauve',
  size = 'md',
  shape = 'rounded',
  className = '',
}) => {
  const prefix = usePrefix();
  const [values, setValues] = useState<Record<string, any>>(() => getInitialValues(schema));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if schema changes dynamically
  useEffect(() => {
    setValues(getInitialValues(schema));
    setErrors({});
  }, [schema]);

  const validateField = (field: FieldSchema, val: any): string => {
    // 1. Required Check
    if (field.required) {
      if (val === undefined || val === null || val === '') {
        return field.validation?.message || 'This field is required.';
      }
      if ((field.type === 'checkbox' || field.type === 'switch') && val === false) {
        return field.validation?.message || 'Must be checked to proceed.';
      }
    }

    // Don't run details checks on empty optional values
    if (val === undefined || val === null || val === '') {
      return '';
    }

    // 2. Type specific checks
    if (field.type === 'number') {
      const numVal = Number(val);
      if (isNaN(numVal)) {
        return 'Please enter a valid number.';
      }
      if (field.validation?.min !== undefined && numVal < field.validation.min) {
        return field.validation.message || `Minimum value is ${field.validation.min}.`;
      }
      if (field.validation?.max !== undefined && numVal > field.validation.max) {
        return field.validation.message || `Maximum value is ${field.validation.max}.`;
      }
    }

    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(val))) {
        return 'Please enter a valid email address.';
      }
    }

    // 3. Custom Regex pattern checks
    if (field.validation?.pattern) {
      try {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(String(val))) {
          return field.validation.message || 'Format is invalid.';
        }
      } catch (e) {
        console.error('Invalid pattern regex in schema', e);
      }
    }

    return '';
  };

  const handleInputChange = (id: string, val: any) => {
    setValues((prev) => ({ ...prev, [id]: val }));
    // Clear validation error when field changes
    if (errors[id]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleBlur = (field: FieldSchema) => {
    const errorMsg = validateField(field, values[field.id]);
    setErrors((prev) => {
      const updated = { ...prev };
      if (errorMsg) {
        updated[field.id] = errorMsg;
      } else {
        delete updated[field.id];
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    schema.forEach((field) => {
      const errorMsg = validateField(field, values[field.id]);
      if (errorMsg) {
        newErrors[field.id] = errorMsg;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);

      // Scroll to first error for smooth UX
      const firstErrorId = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submit error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setValues(getInitialValues(schema));
    setErrors({});
  };

  const renderField = (field: FieldSchema) => {
    const hasError = !!errors[field.id];
    const sharedProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      required: field.required,
      error: hasError,
      color,
      size,
      shape,
      disabled: isLoading || isSubmitting,
      onBlur: () => handleBlur(field),
    };

    switch (field.type) {
      case 'textarea':
        return (
          <TextArea
            {...sharedProps}
            shape={shape === 'pill' ? 'rounded' : shape}
            value={values[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select
            {...sharedProps}
            options={field.options}
            value={values[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            id={field.id}
            name={field.id}
            disabled={isLoading || isSubmitting}
            label={field.placeholder || field.label}
            checked={!!values[field.id]}
            color={color}
            onChange={(e) => handleInputChange(field.id, e.target.checked)}
            onBlur={() => handleBlur(field)}
          />
        );

      case 'switch':
        return (
          <Switch
            id={field.id}
            name={field.id}
            disabled={isLoading || isSubmitting}
            label={field.placeholder || field.label}
            checked={!!values[field.id]}
            color={color}
            onChange={(e) => handleInputChange(field.id, e.target.checked)}
            onBlur={() => handleBlur(field)}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            name={field.id}
            options={field.options || []}
            value={values[field.id]}
            color={color}
            disabled={isLoading || isSubmitting}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );

      case 'slider':
        return (
          <Slider
            id={field.id}
            color={color}
            min={field.validation?.min}
            max={field.validation?.max}
            value={values[field.id] ?? 50}
            disabled={isLoading || isSubmitting}
            onChange={(val) => handleInputChange(field.id, val)}
          />
        );

      case 'number':
      case 'password':
      case 'email':
      case 'date':
      case 'text':
      default:
        return (
          <Input
            {...sharedProps}
            type={field.type}
            value={values[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${cn(prefix, 'form')} ${className}`} noValidate>
      <div className={cnEl(prefix, 'form', 'grid')}>
        {schema.map((field) => {
          const isCheckOrSwitch = field.type === 'checkbox' || field.type === 'switch';
          return (
            <FormGroup
              key={field.id}
              htmlFor={field.id}
              label={!isCheckOrSwitch ? field.label : undefined}
              description={field.description}
              error={errors[field.id]}
              required={field.required}
              width={field.width}
            >
              {renderField(field)}
            </FormGroup>
          );
        })}

        {/* Action Buttons Row */}
        <div className={`${prefix}-form-col-12`} style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Button
            type="submit"
            color={submitButtonColor}
            size={submitButtonSize}
            shape={submitButtonShape}
            isLoading={isLoading || isSubmitting}
          >
            {submitButtonText}
          </Button>

          {showResetButton && (
            <Button
              type="button"
              variant="ghost"
              color="lavender"
              size={submitButtonSize}
              shape={submitButtonShape}
              disabled={isLoading || isSubmitting}
              onClick={handleReset}
            >
              {resetButtonText}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
