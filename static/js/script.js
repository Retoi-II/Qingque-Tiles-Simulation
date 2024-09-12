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

function createTableForIteration(iterationNumber) {
    const container = document.getElementById("iterations-container");

    const iterationLabel = document.createElement("div");
    iterationLabel.className = "iteration-label";
    iterationLabel.innerText = `Iteration ${iterationNumber}`;
    container.appendChild(iterationLabel);

    const table = document.createElement("table");
    table.id = `simulationTable-${iterationNumber}`;
    table.innerHTML = `
            <thead class="table">
                <tr>
                    <th scope="col" class="col-2-75">1</th>
                    <th scope="col" class="col-2-75">2</th>
                    <th scope="col" class="col-2-75">3</th>
                    <th scope="col" class="col-2-75">4</th>
                    <th scope="col" class="col-1"><i class="fa-sharp fa-solid fa-plus"></i></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${createTileOptions(0, 1, iterationNumber)}</td>
                    <td>${createTileOptions(0, 2, iterationNumber)}</td>
                    <td>${createTileOptions(0, 3, iterationNumber)}</td>
                    <td>${createTileOptions(0, 4, iterationNumber)}</td>
                    <td><button class="adjust-btn btn btn-success fa-sharp fa-solid fa-plus" onclick="handleSubmit(0, ${iterationNumber})"></button></td>
                </tr>
            </tbody>
        `;
    container.appendChild(table);
}

// Fungsi untuk menampilkan toast
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    
    // Dapatkan waktu saat ini
    const now = new Date();
    
    // Buat elemen toast baru
    const toastElement = document.createElement('div');
    toastElement.classList.add('toast');
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
        <div class="toast-header">
            <img src="" class="rounded me-2" alt="">
            <strong class="me-auto">Notification</strong>
            <small class="text-muted">${timeAgo(now)}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body text-start">
            ${message}
        </div>
    `;
    
    // Tambahkan toast ke container
    toastContainer.appendChild(toastElement);

    // Inisialisasi Bootstrap Toast dan tampilkan
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Hapus toast dari DOM setelah ditutup
    toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
    });
}

// Fungsi untuk menghitung waktu lalu
function timeAgo(time) {
    const now = new Date();
    const seconds = Math.floor((now - time) / 1000);
    let interval = seconds / 60;

    if (interval < 1) {
        return `${seconds} seconds ago`;
    }
    interval = Math.floor(interval);
    if (interval < 60) {
        return `${interval} minutes ago`;
    }
    interval = Math.floor(interval / 60);
    if (interval < 24) {
        return `${interval} hours ago`;
    }
    interval = Math.floor(interval / 24);
    return `${interval} days ago`;
}

function openFile(fileName) {
    const baseUrl = window.location.origin;
    const currentUrl = window.location.href;

    if (!currentUrl.startsWith(baseUrl) && !currentUrl.startsWith(`${baseUrl}/home`)) {
        // Redirect ke base_url/home jika tidak berada di halaman yang sesuai
        window.location.href = `${baseUrl}/home`;
        return; // Keluar dari fungsi jika redirect
    }
    
    // Jika berada di halaman yang sesuai, muat konten file ke dalam tabel iterasi
    fetch(`/api/files/open/${fileName}`)
        .then(response => response.json())
        .then(content => {
            // Pastikan data file yang diterima adalah format JSON yang valid
            if (content) {
                // Panggil fungsi populateTableFromJson untuk memuat data ke dalam tabel
                populateTableFromJson(content);  // Tanpa iterationNumber karena sudah ditangani oleh fungsi populateTableFromJson
                showToast(`<span class="text-success"><strong>${fileName}</strong> loaded successfully.</span>`);
            } else {
                console.error('No content found in the file.');
                showToast(`<span class="text-danger">Failed to load <strong>${fileName}</strong>.</span>`);
            }
        })
        .catch(error => {
            console.error('Error opening file:', error);
            showToast(`<span class="text-danger">Error opening <strong>${fileName}</strong>.</span>`);
        });
}


function populateTableFromJson(jsonData) {
    if (jsonData["Game Version"]) {
        document.getElementById("gameVersion").value = jsonData["Game Version"];
    }

    // Reset the container if needed
    const container = document.getElementById("iterations-container");
    container.innerHTML = ""; // Clear existing data

    // Iterate over the JSON data and populate the tables
    for (let iteration in jsonData) {
        if (iteration === "Game Version") continue;

        const iterationNumber = parseInt(iteration.replace("Iteration ", ""));
        createTableForIteration(iterationNumber);

        const rows = jsonData[iteration];

        // Jika rows tidak kosong, isi tabel dengan data
        if (rows && rows.length > 0) {
            rows.forEach((row, rowIndex) => {
                if (rowIndex > 0) {
                    // Tambahkan baris baru jika bukan baris pertama
                    addNewRow(rowIndex - 1, [row["Tile 1"], row["Tile 2"], row["Tile 3"], row["Tile 4"]], iterationNumber);
                } else {
                    // Isi baris pertama secara langsung
                    for (let i = 1; i <= 4; i++) {
                        const imgSrc = getImageSource(row[`Tile ${i}`]);
                        selectTile(0, i, row[`Tile ${i}`], imgSrc, iterationNumber);
                    }
                }
            });

            // Tambahkan class 'locked' ke semua <td> sebelum iteration-label
            const table = document.getElementById(`simulationTable-${iterationNumber}`);
            const lastRow = table.querySelector("tbody").lastElementChild; // Ambil baris terakhir

            if (lastRow) {
                const tdElements = lastRow.querySelectorAll('td'); // Ambil semua <td> dalam baris terakhir
                let locked = true;
                tdElements.forEach(td => {
                    if (td.classList.contains('iteration-label')) {
                        locked = false; // Jika menemukan 'iteration-label', stop menambahkan class
                    } else if (locked) {
                        td.classList.add('locked'); // Tambahkan class 'locked' hanya jika masih sebelum iteration-label
                    }
                });
            }
        }
    }

    // Update iteration count ke iterasi terakhir yang ditemukan
    iterationCount = Object.keys(jsonData).length - 1;  // Kurangi 1 karena "Game Version" tidak dihitung sebagai iterasi
}

function renameFile(oldName, listItemElement) {
    // Buat elemen input untuk mengganti nama file
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = oldName;
    inputElement.classList.add('form-control');
    inputElement.style.display = 'inline-block';
    inputElement.style.width = 'auto';

    // Gantikan nama file dengan input di listItemElement
    const fileNameElement = listItemElement.querySelector('.file-name');
    fileNameElement.style.display = 'none'; // Sembunyikan nama file lama
    listItemElement.insertBefore(inputElement, fileNameElement);

    inputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const newName = inputElement.value;
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
                        // Gantikan nama file di list dengan yang baru
                        fileNameElement.textContent = newName;
                        fileNameElement.style.display = 'inline'; // Tampilkan nama file baru
                        inputElement.remove(); // Hapus input

                        // Tampilkan toast
                        showToast(`<span class="text-success">File renamed from <br/><strong>${oldName}</strong> to <br/><strong>${newName}</strong> successfully.</span>`);
                    } else {
                        showToast(`<span class="text-danger">Error renaming file <strong>${oldName}</strong>.</span>`);
                    }
                })
                .catch(error => console.error('Error renaming file:', error));
            } else {
                // Jika tidak ada perubahan nama, tampilkan kembali nama lama dan hapus input
                fileNameElement.style.display = 'inline';
                inputElement.remove();
            }
        }
    });

    // Jika klik di luar input, batalkan penggantian nama
    inputElement.addEventListener('blur', function() {
        fileNameElement.style.display = 'inline';
        inputElement.remove();
    });

    // Fokuskan ke input untuk memulai pengeditan
    inputElement.focus();
}

function deleteFile(fileName, listItemElement) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        fetch(`/api/files/delete/${fileName}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                listItemElement.remove();
                showToast(`<span class="text-success">File <strong>${fileName}</strong></span><span class="text-danger"><strong> deleted</strong></span><span class="text-success"> successfully.</span>`);
            } else {
                showToast(`<span class="text-danger">Error deleting file <strong>${fileName}</strong>.</span>`);
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
            fileActions.style.display = "inline-flex";
        } else {
            fileActions.style.display = "none";
        }
    }

    function loadFiles(showToast = true) {
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
                        <span class="file-name">${file}</span><br/>
                        <div class="file-actions btn-group mt-2" style="display: none;">
                            <a class="btn btn-sm btn-primary" onclick="openFile('${file}', this.closest('li'))"><i class="fa-solid fa-angles-right"></i></a>
                            <a class="btn btn-sm btn-warning" onclick="renameFile('${file}', this.closest('li'))"><i class="fa-regular fa-pen-to-square"></i></a>
                            <a class="btn btn-sm btn-danger" onclick="deleteFile('${file}', this.closest('li'))" ><i class="fa-solid fa-trash"></i></a>
                        </div>
                `;
                fileList.appendChild(li);
            });

            if (showToast && !sessionStorage.getItem('toastShown')) {
                showToast('Files loaded successfully');
                sessionStorage.setItem('toastShown', 'true');
            }
        })
        .catch(error => console.error('Error loading files:', error));
    }

    // Panggil fungsi loadFiles untuk memuat file dari server saat halaman dimuat
    loadFiles();
});
