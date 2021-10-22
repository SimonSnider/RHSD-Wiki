rhit.editFoldersManager = class {
    constructor() {
        document.querySelector("#editButton").onclick = (event) => {
            console.log("editButton Pushed");
            window.location.href = "/editFoldersList.html";
        };
        rhit.fbFolderManager.beginListening(this.populateList.bind(this));
        this.populateList();
    }

    populateList() {
        const newList = htmlToElement('<ul class="folderList"></ul>')
        for (let i = 0; i < rhit.fbFolderManager.length; i++) {
            const folder = rhit.fbFolderManager.getFolderAtIndex(i);
            const newFolderButton = this._createFolderButton(folder);
            // newFolderItem.querySelector("a").onclick = (e) => {
            // 	console.log("folder click");
            // 	newFolderItem.querySelector("ul").slideToggle("fast");
            // 	e.preventDefault();
            // }
            newFolderButton.onclick = (event) => {
                newFolderButton.focus();
            }
            newList.appendChild(newFolderButton);

        }
        const editBar = this._createBar();
        newList.appendChild(editBar);

        const oldList = document.querySelector(".folderList");
        oldList.parentElement.appendChild(newList);
        oldList.remove();
    };

    _createFolderButton(folder) {
        return htmlToElement(`<a href="#" class="list-group-item folderListItem">${folder.name}</a>`);
    };

    _createBar() {
        return htmlToElement(`<div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="Folder name"
                                 aria-label="Recipient's username" aria-describedby="basic-addon2">
                                    <div class="input-group-append">
                                         <button class="btn btn-outline-secondary" type="button"><i class="material-icons">done</i></button>
                                    </div>
                            </div>`);
    };

}

rhit.editFoldersManager = new rhit.editFoldersManager();