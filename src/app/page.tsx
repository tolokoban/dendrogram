import React from "react"
import { ViewButton, ViewPanel } from "@tolokoban/ui"
import { makeGoto } from "./routes"

export default function Page() {
    const [list, setList] = React.useState(["One", "Two", "Three"])
    const handleAdd = () => {
        setList((prev) => [...prev, `Item#${ID++}`])
    }

    return (
        <ViewPanel
            display="flex"
            flexDirection="column"
            alignItems="stretch"
            gap="L"
            fullsize
            position="absolute"
            fontSize="1em"
        >
            <ViewButton onClick={handleAdd}>
                Add new item to the list
            </ViewButton>
            {list.map((v) => (
                <Item key={v} value={v} />
            ))}
            <ViewButton onClick={handleAdd}>
                Add new item to the list
            </ViewButton>
        </ViewPanel>
    )
}

let ID = 0

const Item = React.memo(RawItem)

function RawItem({ value }: { value: string }) {
    const color = `hsl(${Math.floor(Math.random() * 360)} 100% 50%)`
    return <div style={{ background: color, color: "#000" }}>{value}</div>
}
