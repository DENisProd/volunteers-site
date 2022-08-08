export const compare_string = ( left, right )=>
    ( left < right ) ? -1
        : ( left > right ) ? 1
            : 0

export const compare_numb = ( left, right )=>
    left - right

export const compare_field = ( field, compare )=>
    ( left, right )=>
        compare( left[ field ], right[ field ] )

export const compare_combine = ( ... comparators )=>
    ( left, right )=> {
        for( const compare of comparators ) {
            const res = compare( left, right )
            if( res ) return res
        }
        return 0
    }

export const compare_reverse = ( compare )=>
    ( left, right )=> compare( right, left )