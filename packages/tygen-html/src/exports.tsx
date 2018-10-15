import * as React from 'react'

import { BaseView } from './view'
import { ReflectionWithExports } from '@tygen/reflector'
import { NavTree } from './ui/tree-render';
import { buildTreeByType } from './group';
import { Structure } from './structure';

export class ExportsView extends BaseView<ReflectionWithExports> {
	tree = new NavTree(buildTreeByType(this.props.reflection.exports || []))
	render() {
		return <Structure tree={this.tree} />
	}
}
