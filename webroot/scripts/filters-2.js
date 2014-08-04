var filters = {
    documentReady : function () {
        var showEaseMs = 100;

        var skillOpValue = $('#skill-op').val();

        //            $('.filter input').hide();

        function extractSkillValue(filterCtrl) {
            // *NOTE* Not using '\s' as delimitter, because '&nbsp;'
            //        (used to stitch together compound terms)
            //        qualifies as "white-space".
            var result = '';
            $.each($(filterCtrl).parent().text().split(/[\n\t,\x20]+/),
                    function (index, value) {
                        result = value;
                        return (value == '');
                    });
            return result;
        }

        //--------------------------------------------------------
        // Select jobs that required *any* of the selected skills.
        function selectAny() {
            var $skills = $('.filter :checked');

            // If no skills selected, do not filter out jobs.
            if ($skills.length == 0) {
                console.log('*none*');
                $('div[xskills]').show();
                return;
            }

            // Hide all, then show jobs that match any selected skill.
            $('div[xskills]').hide();
            $.each($skills, function (index) {
                var skillValue = extractSkillValue(this);
                var $jobs = $('div[xskills ~= "' + skillValue + '"]');
                $jobs.show();
                $.each($jobs, function () {
                    console.log($('h2,h3', $(this)).text());
                });
                return true;
            });
        }

        //--------------------------------------------------------
        // Select jobs that required *all* of the selected skills
        function selectAll() {
            var $skills = $('.filter :checked');

            // If no skills selected, then do not filter out jobs.
            if ($skills.length == 0) {
                console.log('*none*');
                $('div[xskills]').show();
                return;
            }
            // Show all, then hide jobs that do not match all of 
            // the selected skills.
            $('div[xskills]').show();

            // Iterate over all of the jobs
            $.each($('div[xskills]'), function () {
                $job = $(this);
                var hasSkill = true;

                // For each job, iterate over the selected skill set.
                $.each($skills, function () {
                    var skillValue = extractSkillValue(this);
                    hasSkill = $job.attr('xskills').indexOf(skillValue) > (-1);
                    // Returning false will stop the iteration.
                    return hasSkill;
                });

                if (!hasSkill) {
                    $job.hide();
                } else {
                    console.log($('h2,h3', $job).text());
                }
                return true;
            });
        }

        $('#skill-op').click(function () {
            skillOpValue = $('#skill-op').val();
            console.log('Skill Operator = "' + skillOpValue + '"');

            // If no skill operator selected, hide all filters and show all jobs.
            if (skillOpValue == '') {
                $('.filter input').hide();
                $('div[xskills]').show();
            }

            //                if (skillOpValue == '|') {
            //                    $('.filter input:checked').show(showEaseMs);
            //                    selectAny();
            //                }
            //                if (skillOpValue == '&') {
            //                    $('.filter input:checked').show(showEaseMs)
            //                    selectAll();
            //                }
        });

        //            // Show the filter control when mouse enters
        //            $('.filter').mouseenter(function (src) {
        //                if (skillOpValue != '') {
        //                    $('input[type=checkbox]', src.currentTarget).show(showEaseMs);
        //                }
        //            });
        //
        //            // When mouse leaves, hide the unchecked filters.
        //            $('.filter').mouseleave(function (src) {
        //                if (skillOpValue != '') {
        //                    $('input:not(:checked)', src.currentTarget).hide(showEaseMs);
        //                }
        //            });
        //
        // Activate the filter logic.
        $('.filter input[type=checkbox]').on('click', function (src) {
            console.log('Skill = "' + extractSkillValue(this) + '"');
            $('#skill-op').click();
        });

        // Invoke skill filters when page loaded or reloaded.
        $('#skill-op').click();

    }
}