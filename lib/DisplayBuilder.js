class DisplayBuilder {
	get [Symbol.toStringTag]() {
		return 'DisplayBuilder';
	}
	/* 
		FontSize2 = 2,
		FontSize3 = 3,
		FontSize5 = 5,
		FontSize7 = 7
	*/
	constructor() {
		this.template = {};
		this.template.textContent = {};
		this.template.backButton = "HIDDEN";
		this.template.type = "BodyTemplate2";
	}

	Build() {
		return {
			type: "Display.RenderTemplate",
			template: this.template
		};
	}

	WithBodyTemplate(number) {
		this.template.type = `BodyTemplate${number}`;
		return this;
	}

	WithListTemplate(number, listItems) {
		this.template.type = `ListTemplate${number}`;
		this.template.listItems = listItems;
		return this;
	}

	WithTitle(title) {
		this.template.title = title;
		return this;
	}

	WithToken(token) {
		this.template.token = token;
		return this;
	}

	WithImage(description, url, size) {
		var src = [];
		src.push({ url: url, size: size });

		this.template.image = {
			contentDescription : description,
			sources : src
		};
		return this;
	}


	WithBackgroundImage(description, url, imageSizeEnum) {
		var src = [];
		src.push({ url: url, size: size });

		this.template.backgroundImage = {
			contentDescription : description,
			sources :src
		};
		return this;
	}

	ShowBackButton() {
		this.template.backButton = "VISIBLE";
		return this;
	}

	WithPrimaryPlainText(text) {
		this.template.textContent.primaryText = {
			type: "PlainText",
			text: text
		};
		return this;
	}

	//WithPrimaryPlainText(text, FontSizeEnum fontSize)
	//{
	//	var formated = AMAZON.FontSize.GetText(fontSize, text);
	//	template.TextContent.PrimaryText = formated;
	//	return this;
	//}

	WithSecondaryPlainText(text) {
		this.template.textContent.secondaryText = {
			type: "PlainText",
			text: text
		};
		return this;
	}

	WithTertiaryPlainText(text) {
		this.template.textContent.tertiaryText = {
			type: "PlainText",
			text: text
		};
		return this;
	}

	WithPrimaryRichText(text) {
		this.template.textContent.PrimaryText = {
			type: "RichText",
			text: text
		};
		return this;
	}

	WithPrimaryRichText(text, fontSize) {
		var formated = `<font size="${fontSize}">${text}</font>`;
		this.template.textContent.PrimaryText = {
			type: "RichText",
			text: formated
		};
		return this;
	}

	WithSecondaryRichText(text) {
		this.template.textContent.SecondaryText = {
			type: "RichText",
			text: text
		};
		return this;
	}

	WithSecondaryRichText(text, fontSize) {
		var formated = `<font size="${fontSize}">${text}</font>`;
		this.template.textContent.SecondaryText = {
			type: "RichText",
			text: formated
		};
		return this;
	}

	WithTertiaryRichText(text) {
		this.template.textContent.TertiaryText = {
			type: "RichText",
			text: text
		};
		return this;
	}

	WithTertiaryyRichText(text, fontSize) {
		var formated = `<font size="${fontSize}">${text}</font>`;
		this.template.textContent.TertiaryText = {
			type: "RichText",
			text: formated
		};
		return this;
	}
}

module.exports = DisplayBuilder;