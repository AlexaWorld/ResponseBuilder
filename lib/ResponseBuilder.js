var CardBuilder = require('./CardBuilder');
var DisplayBuilder = require('./DisplayBuilder');

const createSsml= (message) => {
	return {
			type: 'SSML',
			ssml: `<speak> ${message} </speak>`
	};
};

class ResponseBuilder {

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

	get Directives() {
		return this.directives;
	}
	set Directives(value) {
		this.directives = value;
	}

	SaySsml(ssmlBuilder) {
		var ssml = new SsmlBuilder();
		ssmlBuilder(ssml);
		this.response.outputSpeech = ssml.Build();
		return this;
	}

	Say(text) {
		this.response.outputSpeech = {
			type: "PlainText",
			text: text
		};
		return this;
	}

	Ask(text) {
		this.response.reprompt = {
			outputSpeech: {
				type: "PlainText",
				text: text
			}
		};

		this.shouldEndSession = false;
		return this;
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