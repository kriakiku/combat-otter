import { ServiceAreaSteps, TimeoutId } from "@typed";
import { Ref, onMounted, onUnmounted, ref, watch } from "vue";

export const useServiceAreaPreview = (step: Ref<ServiceAreaSteps>) => {
    let previewFetchTimeoutId: TimeoutId | null = null;

    const preview = ref<{
        url: string,
        updatedAt: Date
    } | null>(null);
    
    async function fetchPreview() {
        const needToCapture = step.value === ServiceAreaSteps.CaptureImage;
    
        try {
            const response = await fetch(`backend:///services/area-input${needToCapture ? '?capture' : ''}`)
            const updatedAt = new Date(+response.headers.get('x-image-modify'));

            if (updatedAt.valueOf() !== preview.value?.updatedAt.valueOf()) {
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
        
                preview.value = {
                    url: imageUrl,
                    updatedAt
                }
            }
        } catch (reason) {
            console.info('[area-selector:fetchPreview] fetch error', reason);
        } finally {
            if (needToCapture) {
                previewFetchTimeoutId = setTimeout(fetchPreview, 3500);
            }
        }
    }

    function stopFetchPreview() {
        if (previewFetchTimeoutId) {
            clearTimeout(previewFetchTimeoutId)
        }
    }

    watch(step, () => {
        stopFetchPreview();
        fetchPreview();
    })

    onMounted(fetchPreview)
    
    onUnmounted(stopFetchPreview)

    return preview;
}