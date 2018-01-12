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
		text: message
	};
}

class ResponseBuilder {
	get [Symbol.toStringTag]() {
		return 'ResponseBuilder';
	}

	constructor(alexaRequest) {
		this.response = {};
		this.directives = null;
		this.shouldEndSession = true;
		this.alexaRequest = alexaRequest;

		if (alexaRequest.Session && alexaRequest.Session.attributes)
			this.sessionAttributes = alexaRequest.Session.attributes;
		else
			this.sessionAttributes = {};
	}

	get Response() { return this.response; }

	get SessionAttributes() { return this.sessionAttributes; }

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
		this.response.outputSpeech = this.GetSsml(ssmlBuilder);
		return this;

	}

	AskSsml(ssmlBuilder) {
		this.response.outputSpeech = this.GetSsml(ssmlBuilder);
		this.shouldEndSession = false;
		return this;
	}

	RepromptSsml(ssmlBuilder) {
		this.response.reprompt = {
			outputSpeech: this.GetSsml(ssmlBuilder)
		};
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
		if (this.alexaRequest.Context == null)
			return false;
		if (this.alexaRequest.Context.System == null)
			return false;
		if (this.alexaRequest.Context.System.device == null)
			return false;

		return interfaceType in this.alexaRequest.Context.System.device.supportedInterfaces;

	}

	Build() {
		this.response.shouldEndSession = this.shouldEndSession;

		// It's in the ResponseBuilder so you can decide
		this.AddSessionAttribute("AlexaWorld", this.alexaRequest.SystemState);

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