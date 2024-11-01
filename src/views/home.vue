<script setup>
    import { ref, onMounted } from 'vue';
    import api from '../api';

    const folders = ref([]);
    const files  = ref([]);
    const currentFolder = ref('');

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

    const getCurrentFolder = async($folder) => {
        currentFolder.value = $folder

        console.log($folder);
    }

    const isShowModal = ref(false)

    function closeModal () {
    isShowModal.value = false
    }
    function showModal () {
    isShowModal.value = true
    }

    onMounted(() => {
        fetchDataFolders();
    });

</script>

<template>
    <div class="container-fluid">
        <div class="row flex-nowrap">
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
                            <li class="nav-item" @click="fetchDataFiles(folder.id), getCurrentFolder(folder.folder)" >
                                <a href="#" class="nav-link align-middle px-0">
                                    <font-awesome-icon icon="folder-open" /> 
                                    <span class="ms-1 d-none d-sm-inline">{{ folder.folder }}</span>
                                </a>
                            </li>
                        </span>

                        <button type="button" class="btn btn-primary" style="height: 40px; width: 200px;"><font-awesome-icon icon="plus" />  Add Folder</button>
                    </ul>
                    <hr>
                </div>
            </div>

            <div>
                <div class=" m-3">
                    <button type="button" class="btn btn-primary" style="height: 40px; width: 200px;"><font-awesome-icon icon="plus" /> Add File</button>
                </div>
                <div class="py-3 card-group" style="overflow-y: scroll;">

                    <!-- <form>
                        <div class="mb-3">
                            <label for="" class="form-label fw-bold">Image</label>
                            <input type="file" class="form-control">
                            <div v-if="errors.image" class="alert alert-danger mt-2">
                                <span> {{ errors.image[0] }}</span>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-md btn-success rounded-sm shadow">Save</button>
                    </form> -->
                    
                    <!-- Files List -->
                    <center v-if="files.length == 0">
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
                </div>
            </div>
        </div>
    </div>
</template>