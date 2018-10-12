import { NotIncludedReflection } from '@tygen/reflector'
import { PrettyCode } from './prettier'
import { formatLink } from '../ref-link'

export class NotIncludedPre extends PrettyCode<{ reflection: NotIncludedReflection }> {
	render() {
		const { reflection } = this.props
		return formatLink(reflection).name
	}
}
