import { ModuleInfo, ModuleKind } from '../doc'
import PluginRegistry, {
	ModuleComponentCtor,
	ModulePlugin as ModulePluginInterface,
} from '../explorer/plugins'

import ModuleComponent from './module'

export default function register(reg: PluginRegistry) {
	reg.registerModulePlugin(new ModulePlugin())
}

class ModulePlugin implements ModulePluginInterface {
	isAcceptableModule(module: ModuleInfo): boolean {
		return module.kind === ModuleKind.TypeScript
	}

	getModuleComponent(): ModuleComponentCtor {
		return ModuleComponent
	}
}
