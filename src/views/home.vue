<script setup>
    import { ref, onMounted } from 'vue';
    import api from '../api';

    const folders = ref([]);
    const subFolders = ref([]);
    const files  = ref([]);
    const currentFolder = ref('');
    const currentFolderId = ref('');
    const errors = ref([]);

    const file = ref('');
    const folder_id = ref('');

    const fetchDataFolders = async () => {

        //fetch data 
        await api.get('/api/folders')
        .then(response => {
            folders.value = response.data.data
        });
    }

    const fetchDataFiles = async(id) => {
        await api.get('/api/files', {
            params: {
                folder_id: id
            }
        })
        .then(response => {
            files.value = response.data.data
        });
    }

    const deleteFile = async(id, folder_id) => {
        await api.delete(`/api/files/${id}`)
        .then(response => {
            fetchDataFiles(folder_id);
        });
    }

    const getCurrentFolder = async($folder, $folder_id) => {
        currentFolder.value = $folder;
        currentFolderId.value = $folder_id;
    }

    const isShowModal = ref(false)

    function closeModalFile() {
        isShowModal.value = false

    }

    function showModalFile() {
        console.log(currentFolderId.value);

        isShowModal.value = true
    }

    const isShowModalFolder = ref(false)

    function closeModalFolder() {
        isShowModalFolder.value = false

    }

    function showModalFolder() {
        isShowModalFolder.value = true
    }

    const isShowModalSubFolder = ref(false)

    function closeModalSubFolder() {
        isShowModalSubFolder.value = false

    }

    function showModalSubFolder() {
        isShowModalSubFolder.value = true
    }

    const handleFileChange = (e) => {
        file.value = e.target.files[0];
    }

    const storeFile = async () =>{
        let formData = new FormData();

        formData.append('file', file.value);
        formData.append('folder_id', currentFolderId.value);

        await api.post('api/files', formData)
        .then(() => {
            closeModalFile()
            fetchDataFiles(currentFolderId.value)
        })
        .catch((error) => {
            error.value = error.response.data;
        });
    }

    const storeFolder = async () =>{
        let formData = new FormData();
        let folder = document.getElementById("folder").value;

        formData.append('folder', folder);

        await api.post('api/folders', formData)
        .then(() => {
            closeModalFolder()
            fetchDataFolders()
        })
        .catch((error) => {
            error.value = error.response.data;
        });
    }

    const storeSubFolder = async () =>{
        let formData = new FormData();
        let folder = document.getElementById("folder").value;
        
        formData.append('folder', folder);
        formData.append('parent_id', currentFolderId.value);

        await api.post('api/subfolders', formData)
        .then(response => {
            subFolders.value = response.data.data
            closeModalSubFolder()
            fetchDataSubFolder(currentFolderId.value)
        })
        .catch((error) => {
            error.value = error.response.data;
        });
    }

    const fetchDataSubFolder = async (id) =>{
        await api.get('/api/subfolders', {
            params: {
                parent_id: id
            }
        })
        .then(response => {
            subFolders.value = response.data.data
        });
    }

    const deleteFolder = async(id) => {
        await api.delete(`/api/folders/${id}`)
        .then(response => {
            fetchDataFolders()
        });
    }

    onMounted(() => {
        fetchDataFolders();
    });

</script>

<template>
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <!-- Sidebar -->
            <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-white">
                <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                    <a href="/"
                        class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                        <span class="fs-5 d-none d-sm-inline">Explorer App</span>
                    </a>

                    <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start">
                        <span v-if="folders.length == 0">
                            <li class="nav-item">
                                <a href="#" class="nav-link align-middle px-0">
                                    <span class="ms-1 d-none d-sm-inline">Belum Ada Folder</span>
                                </a>
                            </li>
                        </span>
                        <span v-else v-for="(folder, index) in folders" :key="index">
                            <li class="nav-item" @click="fetchDataFiles(folder.id), fetchDataSubFolder(folder.id), getCurrentFolder(folder.folder, folder.id), closeModalFile()" >
                                <a href="#" class="nav-link align-middle px-0">
                                    <font-awesome-icon icon="folder-open" /> 
                                    <span class="ms-1 d-none d-sm-inline">{{ folder.folder }} </span>
                                    <span style="margin-left: 30px;"></span>
                                    <button type="button"  class="btn btn-sm btn-danger float-end" @click="deleteFolder(folder.id)" style="width:30px !important; height: 30px !important;"><font-awesome-icon icon="trash" /></button>
                                </a>
                               
                            </li>
                        </span>

                        <!-- Form Add Folder -->
                        <form v-if="isShowModalFolder" @submit.prevent="storeFolder()">
                            <input id="folder" name="folder" type="text" class="form-control" placeholder="Nama Folder">
                            <button type="button" class="btn btn-sm btn-warning rounded m-2" @click="closeModalFolder()">Cancel</button>
                            <button type="submit" class="btn btn-sm btn-success rounded m-2">Save</button>
                        </form>

                        <button type="button" class="btn btn-primary" style="height: 40px; width: 200px;" @click="showModalFolder()"><font-awesome-icon icon="plus" />  Add Folder</button>
                    </ul>
                    <hr>
                </div>
            </div>

            <!-- Content -->
            <div>
                <h1 v-if="currentFolderId == '' || currentFolderId == 0">
                    Selamat Datang di Explorer App
                </h1>

                <div v-if="currentFolderId != '' || currentFolderId != 0" class=" m-3">
                    <button type="button" class="btn btn-primary m-1" style="height: 40px; width: 200px;" @click="showModalFile()"><font-awesome-icon icon="plus" /> Add File</button>
                    <button type="button" class="btn btn-primary m-1" style="height: 40px; width: 200px;" @click="showModalSubFolder()"><font-awesome-icon icon="plus" /> Add Sub Folder</button>
                </div>

                <div class="py-3 card-group" style="overflow-y: scroll;">

                    <!-- Form Add File -->
                    <form v-if="isShowModal" @submit.prevent="storeFile()">
                        <div class="mb-3">
                            <label for="" class="form-label">Form Add File</label>
                            <input type="file" class="form-control" accept="image/png,image/jpeg,image/jpg" @change="handleFileChange($event)">
                            <div v-if="errors.file" class="alert alert-danger mt-2">
                                <span> {{ errors.file[0] }}</span>
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-warning rounded m-2" @click="closeModalFile()">Cancel</button>
                        <button type="submit" class="btn btn-sm btn-success rounded m-2">Save</button>
                    </form>

                    <!-- Form Add Sub Folder -->
                    <form v-if="isShowModalSubFolder" @submit.prevent="storeSubFolder()">
                            <input id="folder" name="folder" type="text" class="form-control" placeholder="Nama Folder">
                            <button type="button" class="btn btn-sm btn-warning rounded m-2" @click="closeModalSubFolder()">Cancel</button>
                            <button type="submit" class="btn btn-sm btn-success rounded m-2">Save</button>
                        </form>
                    
                    <!-- Files List -->
                    <center v-if="files.length == 0 && (currentFolderId != '' || currentFolderId != 0)">
                        <div class="d-flex justify-content-center">
                            <center>Tidak ada file pada folder {{ currentFolder }}</center>
                        </div>
                    </center>
                    <span v-else v-for="(file, index) in files" :key="index" >
                        <span class="card m-2" style="width: 120px;">
                            <button type="button" class="btn btn-sm btn-danger" @click="deleteFile(file.id, file.folder_id)"><font-awesome-icon icon="trash" /> Hapus</button>
                            <img class="card-img-top" :src="file.file_hash" alt="Image">
                            <div class="card-body bg-secondary">
                                <p class="card-text text-white" style="font-size: 12px;">{{ file.file }}</p>
                            </div>
                        </span>
                    </span>

                    <!-- Sub Folder List -->
                    <span v-if="subFolders.length > 0" v-for="(subfolder, index) in subFolders" :key="index" >
                        <a href="#" class="nav-link align-middle px-0 m-1">
                            <font-awesome-icon icon="folder-open" /> 
                            <span class="ms-1 d-none d-sm-inline text-dark">{{ subfolder.folder }} </span>
                            <span style="margin-left: 30px;"></span>
                            <button type="button"  class="btn btn-sm btn-danger float-end" @click="deleteFolder(subfolder.id)" style="width:30px !important; height: 30px !important;"><font-awesome-icon icon="trash" /></button>
                        </a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>