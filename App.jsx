import React, { Component } from 'react'
import axios from 'axios'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
registerPlugin(FilePondPluginFileValidateType)
import "filepond/dist/filepond.min.css"


class App extends Component {
    render() {
        return (
            <div>
                <FilePond
                    name="file"
                    required={true}
                    allowMultiple={false}
                    maxFiles={1}
                    allowFileTypeValidation={true}
                    acceptedFileTypes={['application/pdf']}
                    fileValidateTypeLabelExpectedTypesMap={{ 'application/pdf': '.pdf' }}
                    fileValidateTypeLabelExpectedTypes='Debe ser un Pdf'
                    // onupdatefiles={(fileItems) => {
                    //     this.setState({
                    //         file: fileItems && fileItems[0].file
                    //     }) 
                    // }}
                    server={
                        {
                            timeout: 99999,
                            process: (fieldName, file, metadata, load, error, progress, abort) => {

                                const formData = new FormData()
                                formData.append('file', file, file.name)

                                // aborting the request
                                const CancelToken = axios.CancelToken
                                const source = CancelToken.source()

                                axios({
                                    method: 'POST',
                                    url: 'http://localhost:3000/upload',
                                    data: formData,
                                    cancelToken: source.token,
                                    onUploadProgress: (e) => {
                                        // updating progress indicator
                                        progress(e.lengthComputable, e.loaded, e.total)
                                    }
                                }).then(response => {
                                    // passing the file id to FilePond
                                    load(response.file)
                                }).catch((thrown) => {
                                    if (axios.isCancel(thrown)) {
                                        console.log('Request canceled', thrown.message)
                                    } else {
                                        // handle error
                                    }
                                })
                                // Setup abort interface
                                return {
                                    abort: () => {
                                        source.cancel('Operation canceled by the user.')
                                        abort()
                                    }
                                }
                            }

                        }
                    }
                />
            </div>
        )
    }
}

export default App 