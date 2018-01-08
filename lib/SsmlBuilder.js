/* BreakStrength
		none, //: No pause should be outputted. This can be used to remove a pause that would normally occur (such as after a period).
		x_weak,//: No pause should be outputted(same as none).
		weak,//: Treat adjacent words as if separated by a single comma(equivalent to medium).
		medium,//: Treat adjacent words as if separated by a single comma.
		strong,//: Make a sentence break (equivalent to using the <s> tag).
		x_strong,//: Make
 */
class SsmlBuilder {
	constructor() {
		this.stack = [];
		this.textToSpeak = [];
	}

	AddText(text) {
		textToSpeak.push(text);
		return this;
	}

	Whisper() {
		textToSpeak.push("<amazon:effect name=\"whispered\">");
		stack.Push("</amazon:effect>");

		return this;
	}

	Whisper(text) {
		var formated = `<amazon:effect name=\"whispered\">${text}</amazon:effect>`;
		textToSpeak.push(formated);
		return this;
	}

	GetWhisperedText(text) {
		var formated = `<amazon:effect name=\"whispered\">${text}</amazon:effect>`;
		return formated;
	}

	AddSsml(ssml) {
		textToSpeak.push(ssml);
		return this;
	}

	Break(duration) {
		var milliseconds = duration.TotalMilliseconds;

		if (duration > 10000)
			throw new error("milliseconds > 10000");

		var text = `<break time=\"${milliseconds}ms\"/>`;
		textToSpeak.push(text);
		return this;
	}

	Break(strength) {
		//var value = strength.ToString().Replace("_", "-");
		var text = `<break strength=\"${strength}\"/>`;
		textToSpeak.push(text);
		return this;
	}

	Emphasize(text, level) {
		var formated = `<emphasis level="${level}">{text}</emphasis>`;
		textToSpeak.push(formated);
		return this;
	}

	Emphasize(level) {
		textToSpeak.push(`<emphasis level="${level}">`);
		stack.Push("</emphasis>");
		return this;
	}

	Paragraph(text) {
		var formated = `<p>${text}</p>`;
		textToSpeak.push(formated);
		return this;
	}

	Rate(text, rate) {
		textToSpeak.push(Prosody("rate", rate, text));
		return this;
	}

	Rate(rate) {
		textToSpeak.push(GetProsodyStart("rate", rate));
		stack.Push("</prosody>");
		return this;
	}

	Pitch(text, pitch) {
		textToSpeak.push(Prosody("pitch", pitch, text));
		return this;
	}

	Pitch(pitch) {
		textToSpeak.push(GetProsodyStart("pitch", pitch));
		stack.Push("</prosody>");
		return this;
	}

	WithVolume(text, volume) {
		textToSpeak.push(Prosody("volume", volume, text));
		return this;
	}

	Volume(volume) {
		textToSpeak.push(GetProsodyStart("volume", volume));
		stack.Push("</prosody>");
		return this;
	}

	AddSentence(text) {
		var formated = `<s>${text}</s>`;
		textToSpeak.push(formated);
		return this;
	}

	SayAs(text, interpreter) {
		var interpretAs = interpreter.ToString().Replace("_", "-");
		var formated = `<say-as interpret-as="${interpretAs}">${text}</say-as>`;
		textToSpeak.push(formated);
		return this;
	}

	Prosody(key, value, text) {
		//		value = value.ToString().Replace("_", "-");
		var formated = `<prosody ${key}="${value}">${text}</prosody>`;
		return formated;
	}

	CloseAllEffects() {
		while (stack.length > 0)
			CloseEffect();
		return this;
	}

	CloseEffect() {
		if (stack.length < 1)
			return this;

		var closingProsody = stack.pop();
		if (closingProsody)
			textToSpeak.push(closingProsody);
		return this;
	}

	GetProsodyStart(key, value) {
		//value = value.ToString().Replace("_", "-");
		var formated = `<prosody ${key}="${value}">`;
		return formated;
	}

	Build() {
		CloseAllEffects();
		var result = textToSpeak.join(' ');
		return `<speak>${result}</speak>`;
	}
}

module.exports = SsmlBuilder;