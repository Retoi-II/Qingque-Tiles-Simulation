document.querySelectorAll('.navbar-toggle label').forEach(item => {
    item.addEventListener('click', () => {
        item.querySelectorAll('span').forEach(span => {
            if (span.classList.contains('bg-dark')) {
                span.classList.remove('bg-dark');
                span.classList.add('bg-light');
            } else {
                span.classList.remove('bg-light');
                span.classList.add('bg-dark');
            }
        });
    });
});

document.querySelectorAll('.nav-pills li').forEach(item => {
    item.addEventListener('mouseover', () => {
        item.querySelectorAll('a').forEach(span => {
            if (span.classList.contains('active')) {
            } else {
                span.classList.add('active');
            }
        });
    });
    item.addEventListener('mouseout', () => {
        item.querySelectorAll('a').forEach(span => {
            if (span.classList.contains('active')) {
                span.classList.remove('active');
            } else {
            }
        });
    });
});

document.querySelectorAll('.overlay-menu-list li').forEach(item => {
    item.addEventListener('mouseover', () => {
        item.querySelectorAll('a').forEach(span => {
            if (span.classList.contains('active')) {
            } else {
                span.classList.add('active');
            }
        });
    });
    item.addEventListener('mouseout', () => {
        item.querySelectorAll('a').forEach(span => {
            if (span.classList.contains('active')) {
                span.classList.remove('active');
            } else {
            }
        });
    });
});

// Definisikan fungsi-fungsi di scope global
function openFile(fileName) {
    fetch(`/api/files/open/${fileName}`)
        .then(response => response.text())
        .then(content => {
            const contentDiv = document.getElementById('file-content');
            contentDiv.innerHTML = `<pre>${content}</pre>`;
        })
        .catch(error => console.error('Error opening file:', error));
}

function renameFile(oldName) {
    const newName = prompt("Enter new name for the file:", oldName);
    if (newName && newName !== oldName) {
        fetch(`/api/files/rename`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldName, newName }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('File renamed successfully');
                loadFiles(); // Refresh file list
            } else {
                alert('Error renaming file');
            }
        })
        .catch(error => console.error('Error renaming file:', error));
    }
}

function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        fetch(`/api/files/delete/${fileName}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('File deleted successfully');
                loadFiles(); // Refresh file list
            } else {
                alert('Error deleting file');
            }
        })
        .catch(error => console.error('Error deleting file:', error));
    }
}

// Definisikan fungsi di scope global
function openFileFromButton(button) {
    const fileName = button.getAttribute('data-file-name');
    openFile(fileName);
}

function renameFileFromButton(button) {
    const fileName = button.getAttribute('data-file-name');
    renameFile(fileName);
}

function deleteFileFromButton(button) {
    const fileName = button.getAttribute('data-file-name');
    deleteFile(fileName);
}

// Fungsi lainnya tetap sama


// Event handler untuk DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    function toggleFileActions(listItemElement) {
        const fileActions = listItemElement.querySelector('.file-actions');
        
        // Tampilkan/hilangkan file-actions
        if (fileActions.style.display === "none" || fileActions.style.display === "") {
            fileActions.style.display = "block";
        } else {
            fileActions.style.display = "none";
        }
    }

    // Fungsi untuk memuat file dari direktori dan menampilkannya di navigation
    function loadFiles() {
        fetch('/api/files')
            .then(response => response.json())
            .then(files => {
                const fileList = document.getElementById('file-list');
                fileList.innerHTML = ''; // Kosongkan list sebelum menambahkan file

                files.forEach(file => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item', 'list-group-item-action');
                    li.addEventListener('click', function() {
                        toggleFileActions(this);
                    });
                    li.innerHTML = `
                        <span class="file-name">${file}</span>
                        <div class="file-actions" style="display: none;">
                            <button class="btn btn-sm btn-primary" data-file-name="('${file}')" onclick="openFile('${file}'); event.stopPropagation()">Open</button>
                            <button class="btn btn-sm btn-warning" data-file-name="('${file}')" onclick="renameFile('${file}'); event.stopPropagation()">Rename</button>
                            <button class="btn btn-sm btn-danger" data-file-name="('${file}')" onclick="deleteFile('${file}'); event.stopPropagation()">Delete</button>
                        </div>
                    `;
                    fileList.appendChild(li);
                });
            })
            .catch(error => console.error('Error loading files:', error));
    }

    // Panggil fungsi loadFiles untuk memuat file dari server saat halaman dimuat
    loadFiles();
});
