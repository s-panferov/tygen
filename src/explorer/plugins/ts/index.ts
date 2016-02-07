import { Module, ModuleKind } from 'docscript/src/doc';
import PluginRegistry, {
    ModuleComponentCtor,
    ModulePlugin as ModulePluginInterface,
} from 'docscript/src/explorer/plugins';

import ModuleComponent from './module';

export default function register(reg: PluginRegistry) {
    reg.registerModulePlugin(new ModulePlugin());
}

class ModulePlugin implements ModulePluginInterface {
    isAcceptableModule(module: Module): boolean {
        return module.kind == ModuleKind.TypeScript;
    }

    getModuleComponent(): ModuleComponentCtor {
        return ModuleComponent;
    }
}
