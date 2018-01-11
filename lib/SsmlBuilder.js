/* BreakStrength
		none, //: No pause should be outputted. This can be used to remove a pause that would normally occur (such as after a period).
		x_weak,//: No pause should be outputted(same as none).
		weak,//: Treat adjacent words as if separated by a single comma(equivalent to medium).
		medium,//: Treat adjacent words as if separated by a single comma.
		strong,//: Make a sentence break (equivalent to using the <s> tag).
		x_strong,//: Make
 */
class SsmlBuilder {
	get [Symbol.toStringTag]() {
		return 'SsmlBuilder';
	}

	constructor() {
		this.stack = [];
		this.textToSpeak = [];
	}

	AddText(text) {
		this.textToSpeak.push(text);
		return this;
	}

	Whisper() {
		this.textToSpeak.push("<amazon:effect name=\"whispered\">");
		this.stack.Push("</amazon:effect>");

		return this;
	}

	Whisper(text) {
		var formated = `<amazon:effect name=\"whispered\">${text}</amazon:effect>`;
		this.textToSpeak.push(formated);
		return this;
	}

	GetWhisperedText(text) {
		var formated = `<amazon:effect name=\"whispered\">${text}</amazon:effect>`;
		return formated;
	}

	AddSsml(ssml) {
		this.textToSpeak.push(ssml);
		return this;
	}

	Break(duration) {
		var milliseconds = duration.TotalMilliseconds;

		if (duration > 10000)
			throw new error("milliseconds > 10000");

		var text = `<break time=\"${milliseconds}ms\"/>`;
		this.textToSpeak.push(text);
		return this;
	}

	Break(strength) {
		//var value = strength.ToString().Replace("_", "-");
		var text = `<break strength=\"${strength}\"/>`;
		this.textToSpeak.push(text);
		return this;
	}

	Emphasize(text, level) {
		var formated = `<emphasis level="${level}">{text}</emphasis>`;
		this.textToSpeak.push(formated);
		return this;
	}

	Emphasize(level) {
		this.textToSpeak.push(`<emphasis level="${level}">`);
		this.stack.Push("</emphasis>");
		return this;
	}

	Paragraph(text) {
		var formated = `<p>${text}</p>`;
		this.textToSpeak.push(formated);
		return this;
	}

	Rate(text, rate) {
		this.textToSpeak.push(Prosody("rate", rate, text));
		return this;
	}

	Rate(rate) {
		this.textToSpeak.push(GetProsodyStart("rate", rate));
		this.stack.Push("</prosody>");
		return this;
	}

	Pitch(text, pitch) {
		this.textToSpeak.push(Prosody("pitch", pitch, text));
		return this;
	}

	Pitch(pitch) {
		this.textToSpeak.push(GetProsodyStart("pitch", pitch));
		this.stack.Push("</prosody>");
		return this;
	}

	WithVolume(text, volume) {
		this.textToSpeak.push(Prosody("volume", volume, text));
		return this;
	}

	Volume(volume) {
		this.textToSpeak.push(GetProsodyStart("volume", volume));
		this.stack.Push("</prosody>");
		return this;
	}

	AddSentence(text) {
		var formated = `<s>${text}</s>`;
		this.textToSpeak.push(formated);
		return this;
	}

	SayAs(text, interpreter) {
		var interpretAs = interpreter.ToString().Replace("_", "-");
		var formated = `<say-as interpret-as="${interpretAs}">${text}</say-as>`;
		this.textToSpeak.push(formated);
		return this;
	}

	Prosody(key, value, text) {
		//		value = value.ToString().Replace("_", "-");
		var formated = `<prosody ${key}="${value}">${text}</prosody>`;
		return formated;
	}

	CloseAllEffects() {
		while (this.stack.length > 0)
			this.CloseEffect();
		return this;
	}

	CloseEffect() {
		if (this.stack.length < 1)
			return this;

		var closingProsody = this.stack.pop();
		if (closingProsody)
			this.textToSpeak.push(closingProsody);
		return this;
	}

	GetProsodyStart(key, value) {
		//value = value.ToString().Replace("_", "-");
		var formated = `<prosody ${key}="${value}">`;
		return formated;
	}

	Build() {
		this.CloseAllEffects();
		var result = this.textToSpeak.join(' ');
		return {
			type: 'SSML',
			ssml: `<speak> ${result} </speak>`
		};
	}
}

module.exports = SsmlBuilder;