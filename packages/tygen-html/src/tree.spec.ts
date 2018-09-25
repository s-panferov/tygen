import { Tree, TextItem } from './tree'

describe(__dirname, () => {
	it('tree filter', () => {
		const tree = new Tree([
			new TextItem('one', { text: 'One text' }),
			new TextItem('two', { text: 'Two text' }),
			new TextItem('three', { text: 'Three text' })
		])

		tree.filter('one text')
	})
})
