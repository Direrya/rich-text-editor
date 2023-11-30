import $ from 'jquery'
import loadingImg from './loadingImg'

export function onPaste(e, saver, invalidImageSelector, fileTypes, sanitize) {
    console.log('onPaste originalEvent', e.originalEvent)
    const clipboardData = e.originalEvent.clipboardData
    console.log(`clipboardData`, clipboardData)
    const file =
        clipboardData.items &&
        clipboardData.items.length > 0 &&
        clipboardData.items[clipboardData.items.length - 1].getAsFile()

    console.log('clipboardData.items', clipboardData.items)
    if (clipboardData.items.length > 0) {
        console.log(
            `clipboardData.items[clipboardData.items.length - 1].getAsFile(): ${clipboardData.items.length}`,
            clipboardData.items[clipboardData.items.length - 1].getAsFile(),
        )
        console.log('data.kind', clipboardData.items[clipboardData.items.length - 1].kind)
        console.log('data.type', clipboardData.items[clipboardData.items.length - 1].type)
        clipboardData.items[clipboardData.items.length - 1].getAsString((s) => {
            console.log(`getAsString`, s)
        })
    }

    console.log(`onPaste file`, file)
    if (file) {
        console.log(`onPaste onPasteBlob`, file)
        onPasteBlob(e, file, saver, fileTypes)
    } else {
        const clipboardDataAsHtml = clipboardData.getData('text/html')
        console.log(`onPaste clipboardDataAsHtml ${JSON.stringify(clipboardDataAsHtml)}`)
        if (clipboardDataAsHtml)
            onPasteHtml(e, $(e.currentTarget), clipboardDataAsHtml, saver, invalidImageSelector, fileTypes, sanitize)
        else onLegacyPasteImage($(e.currentTarget), saver, invalidImageSelector, fileTypes)
    }
}

function onPasteBlob(event, file, saver, fileTypes) {
    event.preventDefault()
    if (fileTypes.indexOf(file.type) >= 0) {
        saver({ data: file, type: file.type })
            .then((screenshotUrl) => {
                const img = `<img src="${screenshotUrl}"/>`
                window.document.execCommand('insertHTML', false, img)
                return
            })
            .catch((error) => {
                console.error(error)
            })
    }
}

function onPasteHtml(event, $answer, clipboardDataAsHtml, saver, invalidImageSelector, fileTypes, sanitize) {
    event.preventDefault()
    window.document.execCommand('insertHTML', false, sanitize(clipboardDataAsHtml))
    persistInlineImages($answer, saver, invalidImageSelector, fileTypes)
}

function onLegacyPasteImage($editor, saver, invalidImageSelector, fileTypes) {
    persistInlineImages($editor, saver, invalidImageSelector, fileTypes)
}

export function persistInlineImages($editor, screenshotSaver, invalidImageSelector, fileTypes) {
    setTimeout(
        () =>
            Promise.all(
                markAndGetInlineImagesAndRemoveForbiddenOnes($editor, invalidImageSelector, fileTypes).map((data) =>
                    screenshotSaver(data)
                        .then((screenShotUrl) => data.el.setAttribute('src', screenShotUrl))
                        .catch((err) => {
                            data.el.remove()
                            throw err
                        }),
                ),
            ).then(() => $editor.trigger('input')),
        0,
    )
}

function markAndGetInlineImagesAndRemoveForbiddenOnes($editor, invalidImageSelector, fileTypes) {
    console.log('contents', $editor.contents())
    console.log('editor innerHTML', $editor.innerHTML)
    console.log('invalidImageSelector', invalidImageSelector)
    console.log('fileTypes', fileTypes)

    const imagesTemp = $editor.find('img').toArray()
    console.log('imagesTemp', imagesTemp)

    $editor.find(invalidImageSelector).remove()
    const images = $editor
        .find('img[src^="data:image/"]')
        .toArray()
        .map((el) => ({ ...decodeBase64Image(el.getAttribute('src')), el }))
    images.filter(isForbiddenInlineImage).forEach(({ el }) => el.remove())
    console.log('markAndGetInlineImagesAndRemoveForbiddenOnes images', images)
    const pngImages = images.filter(({ type }) => fileTypes.includes(type))
    console.log('markAndGetInlineImagesAndRemoveForbiddenOnes pngImages', pngImages)
    pngImages.forEach(({ el }) => el.setAttribute('src', loadingImg))
    return pngImages

    function isForbiddenInlineImage({ type, el }) {
        const isInlineMathSvg = type === 'image/svg+xml' && el.alt
        if (isInlineMathSvg) {
            return false
        }
        return !fileTypes.includes(type)
    }
}

function decodeBase64Image(dataString) {
    if (!dataString) return null
    const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (matches.length !== 3) {
        return null
    }
    const byteCharacters = atob(matches[2])
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    return {
        type: matches[1],
        data: new Uint8Array(byteNumbers),
    }
}
