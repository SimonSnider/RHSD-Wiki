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

rhit.fbFolderManager = null;
rhit.fbPageManager = null;
rhit.fbOfficerManager = null;
rhit.fbSinglePageManager = null;


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
		console.log("folder manager listening");
		this._ref.orderBy(rhit.FB_FOLDER_KEY_NAME, 'asc').limit(50).onSnapshot((querySnapshot) => {
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
		console.log("page manager listening");
		this._ref.orderBy(rhit.FB_PAGE_KEY_NAME, 'asc').limit(50).onSnapshot((querySnapshot) => {
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

rhit.FbSinglePageManager = class {
	constructor(pageId) {
		console.log("singlePageManager created");
		this._documentSnapshot = null;
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PAGES).doc(pageId);
	}
	beginListening(changeListener) {
		console.log("page manager listening");
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log(doc.data())
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No such document");
			}
		})
	}
	stopListening() { this._unsubscribe(); }
	update(folderID, name, videoLink, body, hidden) {
		this._ref.update({
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

	get name() {
		return this._documentSnapshot.get(rhit.FB_PAGE_KEY_NAME);
	}

	get videoLink() {
		return this._documentSnapshot.get(rhit.FB_PAGE_KEY_VIDEO_LINK);
	}
	
	get body() {
		return this._documentSnapshot.get(rhit.FB_PAGE_KEY_BODY);
	}
	
}

rhit.FbOfficerManager = class {

}

rhit.NavigatorController = class {
	constructor() {
		console.log("NavigatorManager created");
		rhit.fbFolderManager.beginListening(this.updateNavigatorList.bind(this));
		rhit.fbPageManager.beginListening(this.updateNavigatorList.bind(this));
	}

	updateNavigatorList() {
		const newList = htmlToElement('<ul class="directory-list"></ul>')

		for (let i = 0; i < rhit.fbFolderManager.length; i++) {
			const folder = rhit.fbFolderManager.getFolderAtIndex(i);
			if (!folder.hidden) {
				const pages = rhit.fbPageManager.getPagesByFolder(folder.id);

				const newFolderItem = this._createFolderItem(folder);
				
				const newPageList = htmlToElement(`<ul class='navigatorPageList'  style="display: none"></ul>`);
				for (let j = 0; j < pages.length; j++) {
					if (!pages[j].hidden){
						const newPageItem = this._createPageItem(pages[j]);
						//do newPageItem onclicks
						newPageList.appendChild(newPageItem);
					}
				}
				$(newFolderItem).find("a").click(function (e) {
					console.log("folder click");
					$(this).siblings("ul").slideToggle("fast");
					e.preventDefault();
				});
				newFolderItem.appendChild(newPageList);
				newList.appendChild(newFolderItem)
			}

		}

		const oldList = document.querySelector("#leftNavigator > .directory-list");
		oldList.parentElement.appendChild(newList);
		oldList.remove();

	}

	_createFolderItem(folder) {
		return htmlToElement(`<li class='folder'>
								<a href="#">${folder.name}</a> 
							</li>`);
	}

	_createPageItem(page) {
		return htmlToElement(`<li class="navigatorPageItem"><a href="/?id=${page.id}">${page.name}</a></li>`)
	}
}

rhit.PageDetailController = class {
	constructor() {
		console.log("Page Detail Controller created")
		document.querySelector("#videoEmbed").hidden = false;
		rhit.fbSinglePageManager.beginListening(this.updatePage.bind(this));
	}

	updatePage() {
		document.querySelector("#pageTitle").innerHTML = rhit.fbSinglePageManager.name
		document.querySelector("#videoEmbed").src = this.getVideoEmbedCode(rhit.fbSinglePageManager.videoLink);
		document.querySelector("#pageBodyText").innerHTML = rhit.fbSinglePageManager.body
	}

	getVideoEmbedCode(videoLink) {
		//TODO: get video embed code out of the videoLink string
		const urlStart = "https://www.youtube.com/embed/";
		const urlParams = new URLSearchParams(videoLink);
		const vidID = urlParams.get("https://www.youtube.com/watch?v");
		return urlStart + vidID;
	}
}


rhit.main = function () {
	console.log("Ready");
	const urlParams = new URLSearchParams(window.location.search);
	console.log(urlParams.keys().next());
	rhit.fbFolderManager = new rhit.FbFolderManager();
	rhit.fbPageManager = new rhit.FbPageManager();

	if (document.querySelector("#leftNavigator")) {
		new rhit.NavigatorController();
	}
	if (document.querySelector("#pageDetail")) {
		pageId = urlParams.get("id");
		if (pageId) {
			rhit.fbSinglePageManager = new rhit.FbSinglePageManager(pageId);
			new rhit.PageDetailController();
		}
	}
};

rhit.main();
