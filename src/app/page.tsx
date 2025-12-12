import { ViewerDendrogram } from "@/components/viewer-dendrogram"
import { morphology } from "./morphology"

export default function Page() {
    return <ViewerDendrogram morphology={morphology} />
}
