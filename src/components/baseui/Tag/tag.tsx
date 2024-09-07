import React from 'react';
import './tag.scss';
import "remixicon/fonts/remixicon.css";
interface TagProps {
    children: string;
    icon?: string;
    state: 'active' | 'disabled';
    onSelect?: (setSelection: boolean) => void;
    removeable?: boolean;
    onRemove?: () => void;
}
export const Tag: React.FC<TagProps> = (props) => {
    const [selected, setSelected] = React.useState(props.state === 'active');

    const handleClick = () => {
        if (props.state === 'disabled') return;
        if (props.removeable && props.onRemove) {
            handleRemove();
            return;
        } else {
            setSelected(!selected);
            if (props.onSelect) {
                props.onSelect(!selected);
            }
        }
    }

    const handleRemove = () => {
        if (props.state === 'disabled') return;
        if (props.onRemove) {
            props.onRemove();
        }
    }
    return (
        <div className="tag" aria-disabled={props.state === 'disabled'} aria-selected={selected} onClick={handleClick}>
            {props.icon && <i className={`tag__icon ${props.icon}`}></i>}
            <span className="tag__text">{props.children}</span>
            {props.removeable && <i className="tag__remove ri-close-fill"></i>}
        </div>
    );
}
