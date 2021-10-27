rhit.editFoldersController = class {
    constructor() {
        rhit.fbFolderManager.beginListening(this.populateFoldersList.bind(this));
        this.populateFoldersList();

    }

    populateFoldersList() {
        const newList = htmlToElement('<ul class="folderList"></ul>')
        for (let i = 0; i < rhit.fbFolderManager.length; i++) {
            const folder = rhit.fbFolderManager.getFolderAtIndex(i);
            const newFolderButton = this._createFolderButton(folder);
            newFolderButton.onclick = (event) => {
                console.log(`${folder.id}`);
                window.location.href = `/editPagesList.html?fid=${folder.id}`;

            }
            newList.appendChild(newFolderButton);

        }
        const editBar = this._createBar();
        newList.appendChild(editBar);

        const oldList = document.querySelector(".folderList");
        oldList.parentElement.appendChild(newList);
        oldList.remove();


    }

    _createFolderButton(folder) {
        return htmlToElement(`<a href="#" class="list-group-item folderListItem">${folder.name}</a>`);
    }

    _createBar() {
        const editBar = htmlToElement(`<div class="input-group mb-3">
                                <input type="text" id="folderName" class="form-control" placeholder="New Folder Name"
                                 aria-label="Recipient's username" aria-describedby="basic-addon2">
                                    <div class="input-group-append">
                                         <button id = "createFolderButton" class="btn btn-outline-secondary" type="button"><i class="material-icons">done</i></button>
                                    </div>
                            </div>`);
        editBar.querySelector("#createFolderButton").onclick = (event) => {
            const name = editBar.querySelector("#folderName").value;
            console.log(name);
            // rhit.fbFolderManager.update(editBar.querySelector("#folderName").value,false);
            // console.log(rhit.fbFolderManager.docRef.id);
            this._createNewFolder(name);



        };
        return editBar;
    }
    async _createNewFolder(name) {
        const a = firebase.firestore().collection("Folders").doc(name).set({
            name: name,
            hidden: false
        });
        const b = await a;
        window.location.href = `/editPagesList.html?fid=${name}`;
    }

}

rhit.editPagesController = class {
    constructor(folderid) {
        this.folderID = folderid;
        rhit.fbPageManager.beginListening(this.populatePagesList.bind(this));
        this.populatePagesList();
    }

    populatePagesList() {
        const pages = rhit.fbPageManager.getPagesByFolder(this.folderID);
        const newList = htmlToElement('<ul class="pageList"></ul>');
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const newPageButton = this._createPageButton(page);
            newPageButton.onclick = (event) => {
                // document.querySelector("#folderName").value = folder.name;
                console.log(`${page.id}`);
                window.location.href = `/editor.html?pid=${page.id}`;

            }
            newList.appendChild(newPageButton);

        }
        const editBar = this._createBar();
        newList.appendChild(editBar);

        const oldList = document.querySelector(".pageList");
        oldList.parentElement.appendChild(newList);
        oldList.remove();
    }

    _createPageButton(page) {
        return htmlToElement(`<a href="#" class="list-group-item folderListItem">${page.name}</a>`);
    }

    _createBar() {
        const editBar = htmlToElement(`<div class="input-group mb-3">
                                <input type="text" id="pageName" class="form-control" placeholder="New Folder Name"
                                 aria-label="Recipient's username" aria-describedby="basic-addon2">
                                    <div class="input-group-append">
                                         <button id = "createPageButton" class="btn btn-outline-secondary" type="button"><i class="material-icons">done</i></button>
                                    </div>
                            </div>`);
        editBar.querySelector("#createPageButton").onclick = (event) => {
            const name = editBar.querySelector("#pageName").value;
            console.log(name);
            // rhit.fbFolderManager.update(editBar.querySelector("#folderName").value,false);
            // console.log(rhit.fbFolderManager.docRef.id);

            this._setNewPage(name);
        }
        return editBar;
    }
    async _setNewPage(name) {
        const a = firebase.firestore().collection("Pages").doc(name).set({
            name: name,
            hidden: false,
            [rhit.FB_PAGE_KEY_VIDEO_LINK]: "",
            [rhit.FB_PAGE_KEY_BODY]: "",
            [rhit.FB_PAGE_KEY_FOLDER_ID]: new URLSearchParams(window.location.search).get("fid")
        });
        const b = await a;
        window.location.href = `/editor.html?pid=${name}`;
    }

}

if (document.querySelector("#editPagesListPage")) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const folderID = urlParams.get("fid");
    rhit.editPagesController = new rhit.editPagesController(folderID);
}
if (document.querySelector("#editFoldersListPage")) {
    rhit.editFoldersController = new rhit.editFoldersController();
}

document.querySelector("#editButton").onclick = (event) => {
    console.log("editButton Pushed");
    window.location.href = "/editFoldersList.html";
};