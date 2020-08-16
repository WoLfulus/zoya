import { Instance } from 'chalk';
import { context, message } from '../src/fields';
import badge from '../src/fields/badge';
import label from '../src/fields/label';
import level from '../src/fields/level';
import scope from '../src/fields/scope';
import separator from '../src/fields/separator';
import { IField } from '../src/message';

import stripColor = require('strip-color');

const chalk = new Instance({
	level: 3
});

describe('fields', () => {
	function createMessage(
		type: string,
		msg: any,
		{
			context: args,
			options = {}
		}: {
			context?: any;
			options?: any;
		} = {}
	) {
		return {
			context: args,
			fields: [],
			message: msg,
			type: {
				id: type,
				level: 0,
				options
			}
		};
	}

	/**
   * Badge
   */
	describe('badge', () => {
		it('should create a badge label', () => {
			const factory = badge();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field).toBeTruthy();
		});

		it('should create with type that has no id', () => {
			const factory = badge();
			const field = factory({
				context: [],
				fields: [],
				message: 'message',
				type: {
					level: 10
				}
			}) as IField;
			expect(field).toBeTruthy();
		});

		it('should override the default value', () => {
			const factory = badge({ badge: 'heart' });
			const field = factory(createMessage('hello', 'hello')) as IField;
			expect(field.text).toBe('❤️ ');
		});

		it('should not generate json', () => {
			const factory = badge();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field.data).toBeFalsy();
			expect(field.name).toBeFalsy();
		});

		it('should convert badge to emoji', () => {
			const factory = badge();
			const field = factory(
				createMessage('info', 'hello', {
					options: {
						badge: 'heart'
					}
				})
			) as IField;
			expect(field.text).toBe('❤️ ');
		});

		it("should return empty string if emoji can't be found", () => {
			const factory = badge();
			const field = factory(createMessage('a', 'hello')) as IField;
			expect(field.text).toBe('   ');
		});

		it('should return empty string if type is not mapped', () => {
			const factory = badge();
			const field = factory(createMessage('b', 'hello')) as IField;
			expect(field.text).toBe('   ');
		});

		it('should always return a string with 3 of length', () => {
			const factory = badge();

			const field1 = factory(createMessage('info', 'hello')) as IField;
			expect((field1.text as string).length).toBe(3);

			const field2 = factory(createMessage('warn', 'hello')) as IField;
			expect((field2.text as string).length).toBe(3);

			const field3 = factory(createMessage('error', 'hello')) as IField;
			expect((field3.text as string).length).toBe(3);
		});
	});

	/**
   * Context
   */
	describe('context', () => {
		it("should return null if there's no context", () => {
			const factory = context();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field).toBeNull();
		});

		it('should create a context field', () => {
			const factory = context();
			const field = factory(createMessage('info', 'hello', { context: 'context' })) as IField;
			expect(field).toBeTruthy();
		});

		it('should to set the field name', () => {
			const factory = context({ name: 'another_context' });
			const field = factory(createMessage('info', 'hello', { context: 'context' })) as IField;
			expect(field.name).toBe('another_context');
		});

		it('should set a custom transformer', () => {
			const factory = context({ transformer: (scopes) => `[${scopes}]` });
			const field = factory(createMessage('info', 'hello', { context: 'context' })) as IField;
			expect(field.text).toBe('["context"]');
		});
	});

	/**
   * Label
   */
	describe('label', () => {
		it('should create a label field', () => {
			const factory = label();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field).toBeTruthy();
		});

		it('should set the field name', () => {
			const factory = label({ name: 'some_label' });
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field.name).toBe('some_label');
		});

		it("should create a label even if it's not mapped", () => {
			const factory = label();
			const field = factory(createMessage('error', 'hello')) as IField;
			expect(stripColor(field.text as string)).toBe('error');
		});

		it('should use the default formatter for non-mapped types', () => {
			const factory = label({ transformer: (text) => chalk.red(text) });
			const field = factory(createMessage('error', 'hello')) as IField;
			expect(field.text).toEqual(chalk.red('error'));
		});

		it('should work without a transformer', () => {
			const factory = label();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(stripColor(field.text as string)).toEqual('info');
		});

		it('should work with cached label', () => {
			const factory = label();
			const field1 = factory(createMessage('info', 'hello')) as IField; // discarded
			const field2 = factory(createMessage('info', 'hello')) as IField;
			expect(stripColor(field1.text as string)).toEqual('info');
			expect(field1).toStrictEqual(field2);
		});

		it('should accept logger without options', () => {
			const factory = label();
			const field = factory({
				context: undefined,
				fields: [],
				message: 'message',
				type: {
					id: 'info',
					level: 0
				}
			}) as IField;
			expect(stripColor(field.text as string)).toEqual('info');
		});

		it('should use a empty label when type os not present', () => {
			const factory = label();
			const field = factory({
				context: [],
				fields: [],
				message: 'message',
				type: {
					level: 10
				}
			}) as IField;
			// matches length of "info"
			expect(stripColor(field.text as string)).toEqual('');
		});
	});

	describe('level', () => {
		it('should create a level field', () => {
			const factory = level();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field).toBeTruthy();
		});

		it('should set a custom field name', () => {
			const factory = level({ name: 'some_level' });
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field.name).toBe('some_level');
		});

		it('should set the level field value', () => {
			const factory = level();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field).toBeTruthy();
		});
	});

	describe('message', () => {
		it('should create a message field', () => {
			const factory = message();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field).toBeTruthy();
		});

		it('should set a custom field name', () => {
			const factory = message({ name: 'some_message' });
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field.name).toBe('some_message');
		});

		it('should set a custom transformer', () => {
			const factory = message({ transformer: (scopes) => `[${scopes}]` });
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field.text).toBe('[hello]');
		});
	});

	describe('scope', () => {
		it('should create a default scope', () => {
			const factory = scope();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field).toBeTruthy();
		});

		it('should create even without options', () => {
			const factory = scope();
			const field = factory({
				context: [],
				fields: [],
				message: 'message',
				type: {
					level: 10
				}
			}) as IField;
			expect(field).toBeTruthy();
		});

		it('should set a label name', () => {
			const factory = scope({ name: 'some_scope' });
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field.name).toBe('some_scope');
		});

		it('should set a custom scope', () => {
			const factory = scope({ scopes: [ 'scope' ] });
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field.data).toStrictEqual([ 'scope' ]);
		});

		it('should set a custom transformer', () => {
			const factory = scope({
				transformer: (scopes) => `[${scopes.join(' | ')}]`
			});
			const field = factory(
				createMessage('info', 'hello', {
					options: {
						scope: [ 'scope1', 'scope2' ]
					}
				})
			) as IField;
			expect(field.text).toBe('[scope1 | scope2]');
		});
	});

	describe('separator', () => {
		it('should create a separator label', () => {
			const factory = separator();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field).toBeTruthy();
		});

		it('should have a default separator', () => {
			const factory = separator();
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(stripColor(field.text as string)).toBe('»');
		});

		it('should set a custom separator', () => {
			const factory = separator({ separator: '•' });
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(stripColor(field.text as string)).toBe('•');
		});

		it('should set a custom transformer', () => {
			const factory = separator({
				separator: '-',
				transformer: (sep) => chalk.red(sep)
			});
			const field = factory(createMessage('info', 'hello')) as IField;
			expect(field.text).toBe(chalk.red('-'));
		});
	});

	it('should return formatted JSON when passed an object', () => {
		const factory = message({ name: 'some_message' });
		const field = factory(createMessage('debug', { key: true })) as IField;
		expect(field.text).toBe('\u001b[37m{"key":true}\u001b[39m');
	});
});
