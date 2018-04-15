
				import { Test } from './test1'

				enum A {
					B, C, D
				}

				declare module './test1' {
					export interface Test {
						b: A.B
					}
				}
			