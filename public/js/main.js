$(( ) => {
    if($('textarea#ta').length){
        CKEDITOR.replace('ta');
    }

    $('a.confirmDeletion').on('click',()=>{
        if(!confirm('Are you sure want to delete?'))
            return false;
    });
});