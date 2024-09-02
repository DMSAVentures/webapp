import React, {Children, ReactElement} from "react";
import {Badge} from "@/components/baseui/badge/badge";
import './badge-group.scss';

interface BadgeGroupProps {
    children: ReactElement<typeof Badge>[];
}
export const BadgeGroup: React.FC<BadgeGroupProps> = (props: BadgeGroupProps) => {
    const childrenArray = Children.toArray(props.children);
    const visibleBadges = childrenArray.slice(0, 2);
    const hiddenBadgesCount = childrenArray.length - 2;

    return (
        <div className={`badge-group`}>
            {visibleBadges.map((badge, index) => (
                <React.Fragment key={index}>
                    {badge}
                </React.Fragment>
            ))}
            {hiddenBadgesCount > 0 && (
                <Badge size={'small'} styleType={'filled'} variant={"gray"} text={`+${hiddenBadgesCount}`}/>
            )}
        </div>
    );
}
