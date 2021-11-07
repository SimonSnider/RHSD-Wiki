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
rhit.fbAuthManager = null;

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

function getVideoEmbedCode(videoLink) {
	//TODO: get video embed code out of the videoLink string
	const urlStart = "https://www.youtube.com/embed/";
	const urlParams = new URLSearchParams(videoLink);
	const vidID = urlParams.get("https://www.youtube.com/watch?v");
	return urlStart + vidID;
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

rhit.Officer = class {
	constructor(id, username, admin) {
		this.id = id
		this.username = username
		this.admin = admin
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
	//todo: delete function doesn't currently work
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

rhit.FbSingleFolderManager = class {
	constructor(folderID){
		this._documentSnapshot = null;
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_FOLDERS).doc(folderID);
	}
	beginListening(changeListener) {

		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No doc");
			}
		});
	}
	update(name, hidden) {
		this._ref.update({
			[rhit.FB_FOLDER_KEY_NAME]: name,
			[rhit.FB_FOLDER_KEY_HIDDEN]: hidden
		}).then(() => {
			console.log("Folder Sucessfully Updated");
		}).catch((error) => {
			console.error("Error updating document: ", error)
		})
	}
	delete() {
		return this._ref.delete().catch((error) => {
			console.error("Error deleting document: ", error)
		})
	}
	//todo: get getters working
	get name(){
		return this._documentSnapshot.get(rhit.FB_FOLDER_KEY_NAME);	
	}
	get hidden(){
		return this._documentSnapshot.get(rhit.FB_FOLDER_KEY_HIDDEN);
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
		this.pageId = pageId;
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
	update(name, videoLink, body, hidden) {
		return this._ref.update({
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
	delete() {
		return this._ref.delete().catch((error) => {
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
	get folderId() {
		return this._documentSnapshot.get(rhit.FB_PAGE_KEY_FOLDER_ID);
	}
	get hidden() {
		return this._documentSnapshot.get(rhit.FB_PAGE_KEY_HIDDEN);
	}
}

rhit.FbOfficerManager = class {
	constructor() {
		console.log("officerManager created");
		this._documentSnapshots = null;
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_OFFICERS);
	}

	beginListening(changeListener) {
		console.log("officer manager listening");
		this._unsubscribe = this._ref.limit(50).onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	stopListening() { this._unsubscribe(); }
	add(uid) {
		return this._ref.doc(uid).set({
			[rhit.FB_OFFICER_KEY_USERNAME]: uid,
			[rhit.FB_OFFICER_KEY_ADMIN]: false,
		}).then(() => {
			console.log("Officer Successfully added with id:", uid);
		}).catch((error) => {
			console.error("Error updating document: ", error)
		})
	}
	update(id, admin) {
		return this._ref.doc(id).update({
			[rhit.FB_OFFICER_KEY_USERNAME]: id,
			[rhit.FB_OFFICER_KEY_ADMIN]: admin,
		}).then(() => {
			console.log("Officer Sucessfully Updated");
		}).catch((error) => {
			console.error("Error updating document: ", error)
		})
	}
	delete(id) {
		return this._ref.doc(id).delete().catch((error) => {
			console.error("Error deleting document: ", error)
		})
	}

	getOfficerAtIndex(index) {
		let doc = this._documentSnapshots[index]
		return new rhit.Officer(doc.id, doc.get(rhit.FB_OFFICER_KEY_USERNAME), doc.get(rhit.FB_OFFICER_KEY_ADMIN))
	}

	getOfficerByID(uid) {
		for (let doc of this._documentSnapshots) {
			if (doc.id == uid) {
				return new rhit.Officer(doc.id, doc.get(rhit.FB_OFFICER_KEY_USERNAME), doc.get(rhit.FB_OFFICER_KEY_ADMIN))
			}
		}
		return null
	}

	get length() {
		return this._documentSnapshots.length;
	}
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
		document.querySelector("#videoEmbed").src = getVideoEmbedCode(rhit.fbSinglePageManager.videoLink);
		document.querySelector("#pageBodyText").innerHTML = rhit.fbSinglePageManager.body
	}
}

rhit.EditorController = class {
	constructor() {
		this.initialized = false;
		console.log("Editor controller created");
		const inputVideoUrl = document.querySelector("#inputVideoUrl");
		inputVideoUrl.addEventListener('input', () => {
			document.querySelector("#videoEmbed").src = getVideoEmbedCode(inputVideoUrl.value);
		});

		rhit.fbSinglePageManager.beginListening(this.initializeFields.bind(this))
	}

	initializeFields() {
		if (!this.initialized) {
			document.querySelector("#inputPageName").value = rhit.fbSinglePageManager.name;
			document.querySelector("#inputVideoUrl").value = rhit.fbSinglePageManager.videoLink;
			document.querySelector("#inputPageBody").value = rhit.fbSinglePageManager.body;
			document.querySelector("#hiddenCheck").checked = rhit.fbSinglePageManager.hidden;
			document.querySelector("#videoEmbed").src = getVideoEmbedCode(rhit.fbSinglePageManager.videoLink)
			document.querySelector("#cancelButton").onclick = (event) => {
				window.location.href = `/editPagesList.html?fid=${rhit.fbSinglePageManager.folderId}`
			}
			document.querySelector("#saveButton").onclick = (event) => {
				const name = document.querySelector("#inputPageName").value;
				const videoLink = document.querySelector("#inputVideoUrl").value;
				const body = document.querySelector("#inputPageBody").value;
				const hidden = document.querySelector("#hiddenCheck").checked;
				rhit.fbSinglePageManager.update(name, videoLink, body, hidden).then(() => {
					window.location.href = `/?id=${rhit.fbSinglePageManager.pageId}`
				});
			}
			document.querySelector("#submitDeletePage").onclick = (event) => {
				rhit.fbSinglePageManager.delete().then(() => {
					window.location.href = `/editPagesList.html?fid=${rhit.fbSinglePageManager.folderId}`
				})
			}
			this.initialized = true;
		}
	}
}

rhit.FbAuthManager = class {
	constructor() { 
		this._user = null; 
		this._documentSnapshot = null;
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_OFFICERS);
	}
	beginAuthListening(changeListener) {
		console.log("auth listening");
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}

	beginOfficerListening(uid, changeListener) {
		console.log("officer listening");
		this._unsubscribe = this._ref.doc(uid).onSnapshot((doc) => {
			if (doc.exists) {
				console.log(doc.data())
				this._documentSnapshot = doc;
				changeListener();
			} else {
				this._documentSnapshot = null;
				console.log("No such document");
			}
		})
	}

	signIn() { 
		Rosefire.signIn("322fb0bd-8401-4f6e-85cd-4882068b2f46", (err, rfUser) => {
			if (err) {
			  console.log("Rosefire error!", err);
			  return;
			}
			console.log("Rosefire success!", rfUser);
			firebase.auth().signInWithCustomToken(rfUser.token).catch(function(error) {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === 'auth/invalid-custom-token') {
					alert("the token you provided is not valid");
				} else {
					console.error("custom auth error", errorCode, errorMessage);
				}
			}).then(() => {
				window.location.href = "/profile.html"
			})
		});
	}
	signOut() { 
		console.log("signing out");
		firebase.auth().signOut(); 
		window.location.href = "/"	
	}
	get uid() { return this._user.uid; }
	get isSignedIn() { return !!this._user; }
	get isOfficer() {
		return !!this._documentSnapshot
	}
	get isAdmin() {
		return this.isOfficer ? this._documentSnapshot.get(rhit.FB_OFFICER_KEY_ADMIN) : false;
	}
}

rhit.OfficerListPageController = class {
	constructor() {
		console.log("officer list page controller created");
		document.querySelector("#submitAddOfficer").onclick = (event) => {
			let username = document.querySelector("#inputAddOfficerUsername").value
			document.querySelector("#inputAddOfficerUsername").value = ""
			rhit.fbOfficerManager.add(username)
			console.log('username :>> ', username);
		}
		document.querySelector("#submitRemoveOfficer").onclick = (event) => {
			let username = document.querySelector("#inputRemoveOfficerUsername").value
			document.querySelector("#inputRemoveOfficerUsername").value = ""
			let officer = rhit.fbOfficerManager.getOfficerByID(username)
			if (officer) {
				if (officer.admin) {
					console.log("You cannot delete the admin");
				} else {
					rhit.fbOfficerManager.delete(username)
				}
			} else {
				console.log("officer does not exist");
			}
		}
		document.querySelector("#submitTransferAdmin").onclick = (event) => {
			let username = document.querySelector("#inputTransferAdminUsername").value
			document.querySelector("#inputTransferAdminUsername").value = ""
			rhit.fbOfficerManager.update(username, true)
			rhit.fbOfficerManager.update(rhit.fbAuthManager.uid, false)
		}
		rhit.fbAuthManager.beginAuthListening(() => {
			rhit.fbAuthManager.beginOfficerListening(rhit.fbAuthManager.uid, () => {
				if (rhit.fbAuthManager.isAdmin) {
					document.querySelector("#addOfficerButton").style.display = "flex"
					document.querySelector("#removeOfficerButton").style.display = "flex"
					document.querySelector("#transferAdminButton").style.display = "flex"
				}
				
			})
		})
		rhit.fbOfficerManager.beginListening(this.updateView.bind(this))
	}

	updateView() {
		const newList = htmlToElement('<ul></ul>')
		for (let i = 0; i < rhit.fbOfficerManager.length; i++) {
			let officer = rhit.fbOfficerManager.getOfficerAtIndex(i);
			const newOfficerItem = this._createOfficerItem(officer.username + (officer.admin ? " (Admin)" : ""));
			newList.appendChild(newOfficerItem)
		}

		const oldList = document.querySelector("#officerListDiv > ul");
		oldList.parentElement.appendChild(newList);
		oldList.remove();
	}

	_createOfficerItem(officerName) {
		return htmlToElement(`<li class='officer'>
								${officerName}
							</li>`);
	}
}


rhit.ProfilePageController = class {
	constructor() {
		this.init = false
		console.log("profile page controller created");
		document.querySelector("#officerListButton").onclick = (event) => {
			window.location.href = "/officerList.html"
		}
		document.querySelector("#signOutButton").onclick = (event) => {
			rhit.fbAuthManager.signOut()
		}
		rhit.fbAuthManager.beginAuthListening(this.updateView.bind(this))
	}
	
	updateView() {
		document.querySelector("#usernameText").innerHTML = "Username: " + rhit.fbAuthManager.uid		
		if (!this.init) {
			rhit.fbAuthManager.beginOfficerListening(rhit.fbAuthManager.uid, this.updateOfficer.bind(this))
			this.init = true
		}
	}

	updateOfficer() {
		if (rhit.fbAuthManager.isAdmin) {
			document.querySelector("#memberStatusText").innerHTML = "Member status: Admin" 
		}
		else if (rhit.fbAuthManager.isOfficer) {
			document.querySelector("#memberStatusText").innerHTML = "Member status: Officer" 
		}
		else {
			document.querySelector("#memberStatusText").innerHTML = "Member status: Memeber" 
		}
	}
}


rhit.main = function () {
	console.log("Ready");
	const urlParams = new URLSearchParams(window.location.search);
	rhit.fbFolderManager = new rhit.FbFolderManager();
	rhit.fbPageManager = new rhit.FbPageManager();
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginAuthListening(() => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);
		if (rhit.fbAuthManager.isSignedIn) {
			rhit.fbAuthManager.beginOfficerListening(rhit.fbAuthManager.uid, () => {
				console.log("displaying edit button");
				document.querySelector("#editButton").style.display = "flex"
			})
		}
	})
	document.querySelector("#profileButton").onclick = (event) => {
		if (rhit.fbAuthManager.isSignedIn) {
			console.log("moving to profile page");
			window.location.href = "/profile.html"
		} else  {
			rhit.fbAuthManager.signIn()
		}
	}
	if (document.querySelector("#leftNavigator")) {
		new rhit.NavigatorController();
	}
	if (document.querySelector("#pageDetail")) {
		const pageId = urlParams.get("id");
		if (pageId) {
			rhit.fbSinglePageManager = new rhit.FbSinglePageManager(pageId);
			new rhit.PageDetailController();
		}
	}
	if (document.querySelector("#editorPage")) {
		const pageId = urlParams.get("pid");
		if (pageId) {
			rhit.fbSinglePageManager = new rhit.FbSinglePageManager(pageId);
			new rhit.EditorController(pageId);
		}
	}
	if (document.querySelector("#profilePage")) {
		new rhit.ProfilePageController()
	}
	if (document.querySelector("#officerListPage")) {
		rhit.fbOfficerManager = new rhit.FbOfficerManager()
		new rhit.OfficerListPageController()
	}
};

rhit.main();
