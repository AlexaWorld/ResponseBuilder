
class TextBuilder {
	get [Symbol.toStringTag]() {
		return 'TextBuilder';
	}

	constructor() {
		this.textToSpeak = [];
	}

	AddText(text) {
		this.textToSpeak.push(text);
		return this;
	}

	GetText(sep = ' '){
		return this.textToSpeak.join(sep);
	}

	Build(sep = ' ') {
		var result = this.textToSpeak.join(sep);
		return {
			type: 'PlainText',
			ssml: result
		};
	}
}

module.exports = TextBuilder;