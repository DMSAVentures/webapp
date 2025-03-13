import React from 'react';
import './tag.scss';
import "remixicon/fonts/remixicon.css";
import Image from 'next/image';
interface TagProps {
    children: string;
    icon?: string;
    image?: string;
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
            {props.icon && <i className={`${props.icon}`}></i>}
            {!props.icon && props.image && <Image className={'tag__image'} src={props.image} alt="tag" width={24} height={24} />}
            <small className="tag__text">{props.children}</small>
            {props.removeable && <i className="ri-close-fill"></i>}
        </div>
    );
}
