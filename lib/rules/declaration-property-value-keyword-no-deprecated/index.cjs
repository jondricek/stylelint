// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const valueParser = require('postcss-value-parser');
const validateTypes = require('../../utils/validateTypes.cjs');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const getDeclarationValue = require('../../utils/getDeclarationValue.cjs');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const setDeclarationValue = require('../../utils/setDeclarationValue.cjs');
const properties = require('../../reference/properties.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'declaration-property-value-keyword-no-deprecated';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
	rejected: (property, keyword) =>
		`Unexpected deprecated keyword "${keyword}" for property "${property}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-property-value-keyword-no-deprecated',
	fixable: true,
};

const DEPRECATED_COLORS = {
	activecaption: 'canvas',
	appworkspace: 'canvas',
	background: 'canvas',
	inactivecaption: 'canvas',
	infobackground: 'canvas',
	menu: 'canvas',
	scrollbar: 'canvas',
	window: 'canvas',
	activeborder: 'ButtonBorder',
	inactiveborder: 'ButtonBorder',
	threeddarkshadow: 'ButtonBorder',
	threedhighlight: 'ButtonBorder',
	threedlightshadow: 'ButtonBorder',
	threedshadow: 'ButtonBorder',
	windowframe: 'ButtonBorder',
	captiontext: 'CanvasText',
	infotext: 'CanvasText',
	menutext: 'CanvasText',
	windowtext: 'CanvasText',
	buttonhighlight: 'ButtonFace',
	buttonshadow: 'ButtonFace',
	threedface: 'ButtonFace',
	inactivecaptiontext: 'GrayText',
};

/** @type {Array<[singleValueColorProperties[keyof singleValueColorProperties], Record<string, string>]>} */
const COLOR_PROPERTIES = [...properties.singleValueColorProperties.values()].map((value) => [
	value,
	DEPRECATED_COLORS,
]);

const PROPERTY_NAME_TO_KEYWORDS = new Map([
	[
		'appearance',
		/** @type {string[] | Record<string, string>} */ ({
			button: 'auto',
			checkbox: 'auto',
			listbox: 'auto',
			menulist: 'auto',
			meter: 'auto',
			'progress-bar': 'auto',
			'push-button': 'auto',
			radio: 'auto',
			searchfield: 'auto',
			'slider-horizontal': 'auto',
			'square-button': 'auto',
			textarea: 'auto',
		}),
	],
	[
		'image-rendering',
		{
			optimizeQuality: 'smooth',
			optimizeSpeed: 'pixelated',
		},
	],
	['overflow', { overlay: 'auto' }],
	['text-justify', { distribute: 'inter-character' }],
	['text-orientation', { 'sideways-right': 'sideways' }],
	['user-select', { element: 'contain' }],
	['zoom', { reset: '1' }],
	['text-decoration-line', ['blink']],
	['box-sizing', ['padding-box']],
	['image-orientation', ['flip']],
	['min-height', ['intrinsic', 'min-intrinsic']],
	['min-width', ['intrinsic', 'min-intrinsic']],
	['max-height', ['intrinsic', 'min-intrinsic']],
	['max-width', ['intrinsic', 'min-intrinsic']],
	['height', ['intrinsic', 'min-intrinsic']],
	['width', ['intrinsic', 'min-intrinsic']],
	['word-break', ['break-word']],
	...COLOR_PROPERTIES,
]);

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				optional: true,
				actual: secondaryOptions,
				possible: {
					ignoreKeywords: [validateTypes.isString, validateTypes.isRegExp],
				},
			},
		);

		if (!validOptions) return;

		root.walkDecls((decl) => {
			if (!isStandardSyntaxDeclaration(decl)) return;

			const { prop, value } = decl;

			if (optionsMatches(secondaryOptions, 'ignoreKeywords', value)) return;

			const keywords = PROPERTY_NAME_TO_KEYWORDS.get(prop.toLowerCase());

			if (!keywords) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				if (node.type !== 'word') return;

				const lowercasedValue = node.value.toLowerCase();
				let fix;
				let message;
				let messageArgs;

				if (Array.isArray(keywords)) {
					if (!keywords.includes(lowercasedValue)) return;

					message = messages.rejected;
					messageArgs = [prop, value];
				} else {
					const expectedKeyword = keywords[lowercasedValue];

					if (!expectedKeyword) return;

					message = messages.expected;
					messageArgs = [value, expectedKeyword];
					fix = () => {
						node.value = expectedKeyword;
						setDeclarationValue(decl, parsedValue.toString());
					};
				}

				const index = nodeFieldIndices.declarationValueIndex(decl);
				const endIndex = index + value.length;

				report({
					message,
					messageArgs,
					node: decl,
					result,
					ruleName,
					index,
					endIndex,
					fix,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;