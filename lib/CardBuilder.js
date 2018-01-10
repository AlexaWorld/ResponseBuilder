class CardBuilder {
	get [Symbol.toStringTag]() {
		return 'CardBuilder';
	}

	constructor() {
		this.card = {}
	}

	WithSimpleCard(title, content) {
		/*
					public static string SimpleCard = "Simple";
			public static string StandardCard = "Standard";
			public static string LinkAccountCard = "LinkAccount";
		*/
		this.card.type = "Simple";
		this.card.title = title;
		this.card.content = content;
		return this;
	}

	WithStandardCard(title, text, smallImage, largeImage) {
		this.card.type = 'Standard';
		this.card.title = title;
		this.card.text = text;
		this.card.image = {
			"smallImageUrl" : smallImage,
		"largeImageUrl" : largeImage
		};
		return this;
	}

 	WithLinkAccountCard() {
		this.card.type = 'LinkAccount';
		return this;
	}

	WithPermissionsCard() {
		this.card.type = 'AskForPermissionsConsent';
		//this.card.permissions = [];
		return this;
	} 

	Build() {
		return this.card;
	}
}

module.exports = CardBuilder;