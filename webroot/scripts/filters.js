var blackriverinc = blackriverinc || {}
blackriverinc.filters = {

    debug: true,

    glowOn : function($target) {
        $target.not('.ghost').addClass('glow');
        $('.selected-skills .prompt').addClass('highlight');
    },

    glowOff : function($target) {
        $target.removeClass('glow');
        $('.selected-skills .prompt').removeClass('highlight');
    },

    documentReady: function (xdivId) {

        var showEaseMs = 100;

        $('.filter > input').hide();

        if (xdivId === null) {
            xdivId = 'xenvironment';
        }

        var skillOpValue = $('#skill-op').val();

        function extractSkillValue(filterCtrl) {
            // *NOTE* Not using '\s' as delimitter, because '&nbsp;'
            //        (used to stitch together compound terms)
            //        qualifies as "white-space".
            var tokens = $(filterCtrl).text().split(/[\n\t,\x20]+/);
            for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].length > 0) {
                    return tokens[i];
                }
            }
            return "";
        }

        function hideJobDetail($job) {
            $job.addClass('masked');
        }

        //--------------------------------------------------------
        // Select jobs that required *any* of the selected skills.
        function selectAny() {
            var $skills = $('.selected-skills .filter');

            // If no skills selected, do not filter out jobs.
            if ($skills.length == 0) {
                if (blackriverinc.filters.debug) { console.log('*none*'); }
                $('div[' + xdivId + ']').removeClass('masked');
                return;
            }

            // Hide all, then show jobs that match any selected skill.
            $('div[' + xdivId + ']').addClass('masked');
            $.each($skills, function (index) {
                var skillValue = extractSkillValue(this);
                var $jobs = $('div[' + xdivId + ' ~= "' + skillValue + '"]');
                $jobs.removeClass('masked')
                if (blackriverinc.filters.debug) {
                    $.each($jobs, function () {
                        console.log($('h2,h3', $(this)).text());
                    });
                }
                return true;
            });
        }

        //--------------------------------------------------------
        // Select jobs that required *all* of the selected skills
        function selectAll() {
            var $skills = $('.selected-skills .filter');

            // If no skills selected, then do not filter out jobs.
            if ($skills.length == 0) {
                if (blackriverinc.filters.debug) { console.log('*none*'); }
                $('div[' + xdivId + ']').show();
                return;
            }
            // Show all, then hide jobs that do not match all of 
            // the selected skills.
            $('div[' + xdivId + ']').removeClass('masked')

            // Iterate over all of the jobs
            $.each($('div[' + xdivId + ']'), function () {
                $job = $(this);
                var hasSkill = true;

                // For each job, iterate over the selected skill set.
                $.each($skills, function () {
                    var skillValue = extractSkillValue(this);
                    hasSkill = $job.attr(xdivId).indexOf(skillValue) > (-1);
                    // Returning false will stop the iteration.
                    return hasSkill;
                });

                if (!hasSkill) {
                    $job.addClass('masked');
                } else {
                    if (blackriverinc.filters.debug) { console.log($('h2,h3', $job).text()); }
                }
                return true;
            });
        }

        function selectSkills() {
            skillOpValue = $('#skill-op').val();
            if (blackriverinc.filters.debug) { console.log('Skill Operator = ' + skillOpValue); }

            // If no skill operator selected, hide all filters and show all jobs.
            if (skillOpValue == '') {
                $('div[' + xdivId + ']').show();
            }

            if (skillOpValue == '|') {
                selectAny();
            }
            if (skillOpValue == '&') {
                selectAll();
            }
        }

        $('#skill-op').click(selectSkills);

        $('.filter:not(.ghost)').draggable({
            revert: 'invalid',
            helper: 'clone'
        });

          function setClearFilterEvent(target, eventName) {
            $(target).on(eventName, function (src) {
                var skillKey = target.text().trim();
                if (blackriverinc.filters.debug) { console.log('Removed : ' + skillKey); }
                $(src.currentTarget).remove();
                var $ghost = $('.filter.ghost:contains(' + skillKey + ')');
                $ghost.draggable({ disabled: false });
                $ghost.removeClass('ghost');
                if ($('.selected-skills .filter').length == 0) {
                    $('.selected-skills .prompt').show();
                }
                setTimeout(selectSkills, 0);
            });
        }

         $('#skills .filter').mouseover(function (evt) {
            blackriverinc.filters.glowOn($(evt.target));
        });

        $('#skills .filter').mouseout(function (evt) {
            blackriverinc.filters.glowOff($(evt.target));
        });

        $('.selected-skills').mouseover(function () {
            // Don't bother with prompt'n'glow if they already figured it out.
            if ($('.selected-skills .filter').length > 0) {
                return true;
            }
            blackriverinc.filters.glowOn($('#skills .filter'));
        });

        $('.selected-skills').mouseout(function () {
            blackriverinc.filters.glowOff($('#skills .filter'));
        });

        $('.selected-skills').droppable({
            tolerence: "touch",
            drop: function (evt, droppable) {
                blackriverinc.filters.debug && console.log('drop : ' + evt.target.textContent.trim());

                var skillKey = droppable.draggable[0].textContent.trim();

                // Accept a Skill if it is not already attached to the 
                // drop-site.
                if ($(':contains(' + skillKey + ')', evt.target).length == 0) {
                    if (blackriverinc.filters.debug) { console.log('Added : ' + skillKey); }

                    $('.selected-skills .prompt').hide();

                    var clonedTarget = $(droppable.draggable).clone();
                    clonedTarget.append("<img src='chi.black.png' />");
                    $(evt.target).append(clonedTarget);
                
                    droppable.draggable.draggable({ disabled: true });
                    $(droppable.draggable).addClass('ghost');

                    setClearFilterEvent(clonedTarget, 'click');
                    setClearFilterEvent(clonedTarget, 'touchend');

                    setTimeout(selectSkills, 0);

                    return true;
                }
            },
            accept: '.filter'
        });

        // Invoke skill filters when page loaded or reloaded.
        $('#skill-op').click();


    }
}

