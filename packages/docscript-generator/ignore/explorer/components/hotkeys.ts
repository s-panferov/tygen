import * as React from 'react'

export interface HotkeysProps extends React.CommonProps {
	keyMap?: any
	handlers?: { [command: string]: () => void }
}

let hotkeys = require('react-hotkeys')
let Hotkeys: React.ReactCtor<HotkeysProps, void> = hotkeys.HotKeys
export default Hotkeys
