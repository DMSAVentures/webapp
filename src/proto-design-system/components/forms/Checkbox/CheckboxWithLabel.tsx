import { forwardRef, useId } from "react";
import { cn } from "../../../utils/cn";
import { Badge } from "../../primitives/Badge";
import { Link } from "../../primitives/Button";
import styles from "./Checkbox.module.scss";
import { Check, Minus } from "lucide-react";

export type CheckboxWithLabelSize = "sm" | "md" | "lg";
export type CheckboxState = "checked" | "unchecked" | "indeterminate";
export type BadgeColour = "blue" | "green" | "red" | "yellow" | "gray";

export interface CheckboxWithLabelProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "checked" | "onKeyDown"> {
  /** Checkbox state: checked, unchecked, or indeterminate */
  checked: CheckboxState;
  /** Label text */
  text: string;
  /** Description text below label */
  description?: string;
  /** Size variant */
  size?: CheckboxWithLabelSize;
  /** Flip the checkbox to the right side of the label */
  flipCheckboxToRight?: boolean;
  /** Error state */
  isError?: boolean;
  /** Badge string to display (e.g., "Pro") */
  badgeString?: string;
  /** Badge color */
  badgeColour?: BadgeColour;
  /** Link title text */
  linkTitle?: string;
  /** Link href */
  linkHref?: string;
}

const mapBadgeColour = (colour?: BadgeColour): "primary" | "success" | "error" | "warning" | "secondary" => {
  switch (colour) {
    case "blue":
      return "primary";
    case "green":
      return "success";
    case "red":
      return "error";
    case "yellow":
      return "warning";
    case "gray":
    default:
      return "secondary";
  }
};

/**
 * CheckboxWithLabel component - Checkbox with enhanced label, description, badge, and link support.
 *
 * @example
 * ```tsx
 * <CheckboxWithLabel
 *   checked="checked"
 *   text="Enable feature"
 *   description="This will enable the feature for all users"
 *   onChange={(e) => handleChange(e.target.checked)}
 * />
 * <CheckboxWithLabel
 *   checked="unchecked"
 *   text="Premium feature"
 *   description="Only available on Pro plan"
 *   badgeString="Pro"
 *   badgeColour="blue"
 *   linkTitle="Upgrade"
 *   linkHref="/billing/plans"
 *   disabled
 * />
 * ```
 */
export const CheckboxWithLabel = forwardRef<HTMLInputElement, CheckboxWithLabelProps>(
  (
    {
      checked,
      text,
      description,
      size = "md",
      flipCheckboxToRight = false,
      isError,
      badgeString,
      badgeColour,
      linkTitle,
      linkHref,
      id: providedId,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const descriptionId = description ? `${id}-description` : undefined;

    const isChecked = checked === "checked";
    const isIndeterminate = checked === "indeterminate";

    const checkboxElement = (
      <div className={styles.checkboxWrapper}>
        <input
          ref={(node) => {
            if (node) {
              node.indeterminate = isIndeterminate;
            }
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="checkbox"
          id={id}
          disabled={disabled}
          checked={isChecked}
          aria-describedby={descriptionId}
          className={cn(styles.input, styles[`size-${size}`], isError && styles.error)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.click();
            }
          }}
          {...props}
        />
        <div className={cn(styles.checkbox, styles[`size-${size}`])} aria-hidden="true">
          {isIndeterminate ? <Minus className={styles.icon} /> : <Check className={styles.icon} />}
        </div>
      </div>
    );

    const labelContent = (
      <div className={styles.content}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <label htmlFor={id} className={cn(styles.label, styles[`label-${size}`])}>
            {text}
          </label>
          {badgeString && (
            <Badge variant={mapBadgeColour(badgeColour)} size="sm">
              {badgeString}
            </Badge>
          )}
          {linkTitle && linkHref && (
            <Link href={linkHref} size="sm" variant="primary">
              {linkTitle}
            </Link>
          )}
        </div>
        {description && (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        )}
      </div>
    );

    return (
      <div
        className={cn(styles.container, disabled && styles.disabled, className)}
        style={flipCheckboxToRight ? { flexDirection: "row-reverse", justifyContent: "space-between" } : undefined}
      >
        {flipCheckboxToRight ? (
          <>
            {labelContent}
            {checkboxElement}
          </>
        ) : (
          <>
            {checkboxElement}
            {labelContent}
          </>
        )}
      </div>
    );
  }
);

CheckboxWithLabel.displayName = "CheckboxWithLabel";
