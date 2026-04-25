export function DeckCardSkeleton() {
    return (
        <div className='bg-gray-700 rounded-lg p-6 flex flex-col justify-between animate-pulse'>
            <div>
                <div className='h-5 bg-gray-600 rounded w-3/4 mb-3'></div>
                <div className='h-3 bg-gray-600 rounded w-full mb-2'></div>
                <div className='h-3 bg-gray-600 rounded w-2/3'></div>
            </div>
            <div className='flex gap-2 mt-6'>
                <div className='flex-1 h-8 bg-gray-600 rounded-full'></div>
                <div className='flex-1 h-8 bg-gray-600 rounded-full'></div>
            </div>
        </div>
    );
}
