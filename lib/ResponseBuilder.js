var CardBuilder = require('./CardBuilder');
var DisplayBuilder = require('./DisplayBuilder');
var SsmlBuilder = require('./SsmlBuilder');
var isTypeOf = require('alexaworld-nodejs-common').isTypeOf;

const createSsml = (message) => {
	return {
		type: 'SSML',
		ssml: `<speak> ${message} </speak>`
	};
}

const createText = (message) => {
	return {
		type: "PlainText",
		text: text
	};
}

class ResponseBuilder {
	get [Symbol.toStringTag]() {
		return 'ResponseBuilder';
	}

	constructor(context) {
		this.context = context;
		this.sessionAttributes = {};
		this.response = {};
		this.directives = null;
		this.shouldEndSession = true;
	}

	AddDirective(directive) {
		if (!this.directives)
			this.directives = [];
		this.directives.push(directive);
	}

	AddSessionAttribute(key, value) {
		this.sessionAttributes[key] = value;
	}

	get Directives() {
		return this.directives;
	}
	set Directives(value) {
		this.directives = value;
	}

	Say(text) {
		this.response.outputSpeech = createText(text);
		return this;
	}

	Ask(text) {
		this.response.outputSpeech = createText(text);
		this.shouldEndSession = false;
		return this;
	}

	Reprompt(text) {
		this.response.reprompt = createText(text);
		this.shouldEndSession = false;
		return this;
	}

	SaySsml(ssmlBuilder) {
		this.response.outputSpeech = GetSsml(ssmlBuilder);
		return this;

	}

	AskSsml(ssmlBuilder) {
		this.response.outputSpeech = GetSsml(ssmlBuilder);
		this.shouldEndSession = false;
		return this;
	}

	RepromptSsml(ssmlBuilder) {
		this.response.reprompt = GetSsml(ssmlBuilder)
		this.shouldEndSession = false;
		return this;
	}

	GetSsml(ssmlBuilder) {

		// String aa SSML
		if (isTypeOf(ssmlBuilder, 'String')) {
			return createSsml(ssmlBuilder);
		}

		// Already a SSML objekt
		if (isTypeOf(ssmlBuilder, 'Object')) {
			return ssmlBuilder;
		}

		// A SsmlBuilder
		if (isTypeOf(ssmlBuilder, 'SsmlBuilder')) {
			return ssmlBuilder.Build();
		}

		// Arrow function With SsmlBuilder
		var ssml = new SsmlBuilder();
		ssmlBuilder(ssml);
		return ssml.Build();
	}

	WithCard(build) {
		var builder = new CardBuilder();
		build(builder);
		this.response.card = builder.Build();
		return this;
	}

	WithDisplay(build) {
		if (this.IsInterfaceSupported("Display")) {
			var builder = new DisplayBuilder();
			build(builder);
			var display = builder.Build();
			this.AddDirective(display);
		}
		return this;
	}

	IsInterfaceSupported(interfaceType) {
		if (this.context == null)
			return false;
		if (this.context.System == null)
			return false;
		if (this.context.System.device == null)
			return false;

		return interfaceType in this.context.System.device.supportedInterfaces;

	}

	Build() {
		this.response.shouldEndSession = this.shouldEndSession;

		let result = {
			version: '1.0',
			response: this.response,
			sessionAttributes: this.sessionAttributes
		};

		if (this.directives)
			result.response.directives = this.directives;

		return result;
	}

}

module.exports = ResponseBuilder;