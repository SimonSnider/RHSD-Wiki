var rhit = rhit || {};

rhit.FB_COLLECTION_FOLDERS = "Folders";
rhit.FB_COLLECTION_OFFICERS = "Officers";
rhit.FB_COLLECTION_PAGES = "Pages";

rhit.FB_FOLDER_KEY_NAME = "name";
rhit.FB_FOLDER_KEY_HIDDEN = "hidden";
rhit.FB_OFFICER_KEY_ADMIN = "admin";
rhit.FB_OFFICER_KEY_USERNAME = "username";
rhit.FB_PAGE_KEY_BODY = "body";
rhit.FB_PAGE_KEY_FOLDER_ID = "folderID";
rhit.FB_PAGE_KEY_NAME = "name";
rhit.FB_PAGE_KEY_VIDEO_LINK = "videoLink";
rhit.FB_PAGE_KEY_HIDDEN = "hidden";


function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.Folder = class {
	constructor(id, name, hidden) {
		this.id = id;
		this.name = name;
		this.hidden = hidden;
	}
}

rhit.Page = class {
	constructor(id, name, folderID, videoLink, body, hidden) {
		this.id = id;
		this.name = name;
		this.hidden = hidden;
		this.body = body;
		this.videoLink = videoLink;
		this.folderID = folderID;
	}
}

rhit.FbFolderManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_FOLDERS);
	}
	add(name, hidden) {
		this._ref.add({
			[rhit.FB_FOLDER_KEY_NAME]: name,
			[rhit.FB_FOLDER_KEY_HIDDEN]: hidden,
		})
			.then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			})
	}
	beginListening(changeListener) {
		this._ref.orderBy(rhit.FB_FOLDER_KEY_NAME, 'desc').limit(50).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}
	stopListening() { }
	update(id, name, hidden) {
		docRef = this._ref.doc(id);
		docRef.update({
			[rhit.FB_FOLDER_KEY_NAME]: name,
			[rhit.FB_FOLDER_KEY_HIDDEN]: hidden
		}).then(() => {
			console.log("Folder Sucessfully Updated");
		}).catch((error) => {
			console.error("Error updating document: ", error)
		})
	}
	delete(id) {
		docRef = this._ref.doc(id);
		return docRef.delete().catch((error) => {
			console.error("Error deleting document: ", error)
		})
	}
	get length() { return this._documentSnapshots.length }
	getFolderAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const folder = new rhit.Folder(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_FOLDER_KEY_NAME),
			docSnapshot.get(rhit.FB_FOLDER_KEY_HIDDEN))
		return folder
	}
}

rhit.FbPageManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PAGES);
	}
	add(folderID, name, videoLink, body, hidden) {
		this._ref.add({
			[rhit.FB_PAGE_KEY_FOLDER_ID]: folderID,
			[rhit.FB_PAGE_KEY_NAME]: name,
			[rhit.FB_PAGE_KEY_VIDEO_LINK]: videoLink,
			[rhit.FB_PAGE_KEY_BODY]: body,
			[rhit.FB_PAGE_KEY_HIDDEN]: hidden
		})
			.then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			})
	}
	beginListening(changeListener) {
		this._ref.orderBy(rhit.FB_PAGE_KEY_NAME, 'desc').limit(50).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}
	stopListening() { }
	update(id, folderID, name, videoLink, body, hidden) {
		docRef = this._ref.doc(id);
		docRef.update({
			[rhit.FB_PAGE_KEY_FOLDER_ID]: folderID,
			[rhit.FB_PAGE_KEY_NAME]: name,
			[rhit.FB_PAGE_KEY_VIDEO_LINK]: videoLink,
			[rhit.FB_PAGE_KEY_BODY]: body,
			[rhit.FB_PAGE_KEY_HIDDEN]: hidden
		}).then(() => {
			console.log("Page Sucessfully Updated");
		}).catch((error) => {
			console.error("Error updating document: ", error)
		})
	}
	delete(id) {
		docRef = this._ref.doc(id);
		return docRef.delete().catch((error) => {
			console.error("Error deleting document: ", error)
		})
	}
	get length() { return this._documentSnapshots.length }
	getPagesByFolder(folderID) {
		return this._documentSnapshots.filter(obj => {
			return obj.get(rhit.FB_PAGE_KEY_FOLDER_ID) == folderID;
		}).map((obj) => {
			return new rhit.Page(
				obj.id,
				obj.get(rhit.FB_PAGE_KEY_NAME),
				obj.get(rhit.FB_PAGE_KEY_FOLDER_ID),
				obj.get(rhit.FB_PAGE_KEY_VIDEO_LINK),
				obj.get(rhit.FB_PAGE_KEY_BODY),
				obj.get(rhit.FB_PAGE_KEY_HIDDEN)
			)
		});
	}
	getPageById(id) {
		const docRef = this._ref.doc(id);
		return new rhit.Page(
			docRef.id,
			docRef.get(rhit.FB_PAGE_KEY_NAME),
			docRef.get(rhit.FB_PAGE_KEY_FOLDER_ID),
			docRef.get(rhit.FB_PAGE_KEY_VIDEO_LINK),
			docRef.get(rhit.FB_PAGE_KEY_BODY),
			docRef.get(rhit.FB_PAGE_KEY_HIDDEN)
		)
	}
}

rhit.FbOfficerManager = class {

}


rhit.main = function () {
	console.log("Ready");
};

rhit.main();
