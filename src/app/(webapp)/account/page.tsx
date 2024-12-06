import {Column} from "@/components/simpleui/UIShell/Column/Column";
import Breadcrumb from "@/components/simpleui/breadcrumb/breadcrumb";

export default function Page() {
    return (
        <>
            <Column sm={{span: 7, start: 1}} >
                <h3>Account</h3>
            </Column>
            <Column sm={{span: 7, start: 1}} md={{start: 1, span: 7}} lg={{start: 1, span: 11}} xlg={{start: 1, span: 13}}>
                Content
            </Column>
        </>
    );
}
