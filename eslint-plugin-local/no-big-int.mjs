'use strict'

export default {
    meta: {
        docs: {
            description: 'disallow `bigint` syntax',
            category: 'ES2020',
            recommended: false,
        },
        fixable: null,
        messages: {
            forbidden: 'ES2020 `bigint` syntax is forbidden.',
        },
        schema: [],
        type: 'problem',
    },
    create(context) {
        return {
            Literal(node) {
                if (node.bigint != null) {
                    context.report({ messageId: 'forbidden', node })
                }
            },
        }
    },
}
