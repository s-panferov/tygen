import { TypeParameterReflection } from '@tygen/reflector/src/reflection/type-parameter/reflection'
import { PrettyCode } from '../prettier'

export class TypeParameterPre extends PrettyCode<{ reflection: TypeParameterReflection }> {
	render() {
		const { reflection } = this.props
		return reflection.name
	}
}
