import React from 'react';
import './buttongroup.scss';
import 'remixicon/fonts/remixicon.css';

interface ButtonItemProps {
    text: string;
    iconPosition: 'left' | 'right';
    icon: string;
    iconOnly: boolean;
    onClick: () => void;
    disabled?: boolean;
}

//TODO: Implement Dropdown button item
interface ButtonGroupProps {
    items: ButtonItemProps[];
    size: 'small' | 'x-small' | '2x-small';
}
const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
    return (
        <div className={`button-group button-group--${props.size}`}>
            {props.items.map((item, index) => {
                return (
                    <button
                        className={`button-item button-item--${props.size} button-item--${item.iconOnly ? 'icon-only' : 'icon-text'} button-item__icon--${item.iconPosition}`}
                        key={index}
                        onClick={item.onClick}
                        disabled={item.disabled}
                    >
                        <i className={`button__icon ${item.icon}`} />
                        {!item.iconOnly && <span className="button__text">{item.text}</span>}
                    </button>
                );
            })}
        </div>
    );
}

export default ButtonGroup;
